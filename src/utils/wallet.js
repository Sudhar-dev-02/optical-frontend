/**
 * Utility functions for customer wallet calculations, profile ledger aggregation, and audit logs
 */

export const calculateCustomerWallet = (mrdOrPhone, bills = []) => {
  if (!mrdOrPhone || !bills || !Array.isArray(bills) || bills.length === 0) return 0;

  const q = String(mrdOrPhone).trim().toLowerCase();
  const cleanQ = q.replace(/^0+/, '');
  const rawDigits = q.replace(/\D/g, '');

  let balance = 0;

  // 1. Direct bills: sum (cashbackEarned - walletRedeemed)
  bills.forEach(bill => {
    const bMrd = (bill.customer?.mrdNo || '').toString().trim().toLowerCase();
    const bCleanMrd = bMrd.replace(/^0+/, '');
    const bPhone = (bill.customer?.phone || '').toString().replace(/\D/g, '');

    const isMatch = (bMrd && (bMrd === q || (cleanQ && bCleanMrd === cleanQ))) ||
                    (rawDigits && rawDigits.length >= 7 && bPhone === rawDigits);

    if (isMatch) {
      const earned = Number(bill.cashbackEarned) || 0;
      const redeemed = Number(bill.walletRedeemed) || 0;
      balance += (earned - redeemed);
    }
  });

  // 2. Referral bonuses: sum 10% of netAmount for each referred customer purchase
  bills.forEach(bill => {
    const refMrd = (bill.referrerMrd || '').toString().trim().toLowerCase();
    const refCleanMrd = refMrd.replace(/^0+/, '');
    const refPhone = (bill.referrerPhone || '').toString().replace(/\D/g, '');
    const net = Number(bill.netAmount) || 0;
    const refBonus = Math.round(net * 0.10);

    if (refBonus > 0) {
      const isRefMatch = (refMrd && (refMrd === q || (cleanQ && refCleanMrd === cleanQ))) ||
                         (rawDigits && rawDigits.length >= 7 && refPhone === rawDigits);
      if (isRefMatch) {
        balance += refBonus;
      }
    }
  });

  return Math.max(0, balance);
};

export const getCustomerWalletProfiles = (bills = []) => {
  const map = {};

  // Pass 1: Aggregate own bills & direct cashbacks / redemptions
  bills.forEach(bill => {
    const phoneKey = bill.customer?.phone ? bill.customer.phone.replace(/\D/g, '') : `NO_PHONE_${bill.billNo}`;
    const mrdKey = (bill.customer?.mrdNo || '').toLowerCase().trim().replace(/^0+/, '');

    if (!map[phoneKey]) {
      map[phoneKey] = {
        phoneKey,
        name: bill.customer?.name || 'Unnamed Customer',
        phone: bill.customer?.phone || '',
        mrdNo: bill.customer?.mrdNo || '',
        cleanMrd: mrdKey,
        address: bill.customer?.address || '',
        gender: bill.customer?.gender || 'Male',
        age: bill.customer?.age || '',
        bills: [],
        totalSpend: 0,
        totalBalance: 0,
        directCashbackEarned: 0,
        referralBonusEarned: 0,
        walletRedeemed: 0,
        walletBalance: 0,
        referralCount: 0,
        referrals: [],
        ledger: [],
        latestDate: bill.date || bill.createdAt || new Date().toISOString()
      };
    }

    const netAmt = Number(bill.netAmount) || 0;
    const earned = Number(bill.cashbackEarned) || 0;
    const redeemed = Number(bill.walletRedeemed) || 0;

    map[phoneKey].bills.push(bill);
    map[phoneKey].totalSpend += netAmt;
    map[phoneKey].totalBalance += (Number(bill.balanceAmount) || 0);
    map[phoneKey].directCashbackEarned += earned;
    map[phoneKey].walletRedeemed += redeemed;

    // Add Direct Cashback Earned to ledger
    if (earned > 0) {
      map[phoneKey].ledger.push({
        id: `earn_${bill._id || bill.billNo}`,
        date: bill.date || bill.createdAt || new Date().toISOString(),
        type: 'CASHBACK',
        title: 'Purchase Cashback (10%)',
        billNo: bill.billNo,
        amount: earned,
        netAmount: netAmt,
        note: `10% Cashback earned on Bill #${bill.billNo}`
      });
    }

    // Add Redemption to ledger
    if (redeemed > 0) {
      map[phoneKey].ledger.push({
        id: `redeem_${bill._id || bill.billNo}`,
        date: bill.date || bill.createdAt || new Date().toISOString(),
        type: 'REDEEMED',
        title: 'Wallet Redeemed',
        billNo: bill.billNo,
        amount: -redeemed,
        netAmount: netAmt,
        note: `Redeemed ₹${redeemed} on Bill #${bill.billNo}`
      });
    }
  });

  // Pass 2: Credit 10% Referral Bonus to Referrer
  bills.forEach(bill => {
    const refMrd = (bill.referrerMrd || '').toLowerCase().trim().replace(/^0+/, '');
    const refPhone = (bill.referrerPhone || '').replace(/\D/g, '');
    const net = Number(bill.netAmount) || 0;
    const refBonus = Math.round(net * 0.10);

    if (refBonus > 0 && (refMrd || refPhone)) {
      const referrer = Object.values(map).find(c =>
        (refMrd && c.cleanMrd === refMrd) ||
        (refMrd && c.mrdNo && c.mrdNo.toLowerCase().trim() === refMrd) ||
        (refPhone && c.phone.replace(/\D/g, '') === refPhone)
      );

      if (referrer) {
        referrer.referralBonusEarned += refBonus;
        referrer.referralCount = (referrer.referralCount || 0) + 1;
        referrer.referrals.push({
          purchaserName: bill.customer?.name || 'Referred Customer',
          purchaserPhone: bill.customer?.phone || '',
          purchaserMrd: bill.customer?.mrdNo || '',
          billNo: bill.billNo,
          date: bill.date || bill.createdAt || new Date().toISOString(),
          orderAmount: net,
          bonusEarned: refBonus
        });

        referrer.ledger.push({
          id: `ref_${bill._id || bill.billNo}`,
          date: bill.date || bill.createdAt || new Date().toISOString(),
          type: 'REFERRAL_BONUS',
          title: 'Referral Bonus (10%)',
          billNo: bill.billNo,
          amount: refBonus,
          netAmount: net,
          purchaserName: bill.customer?.name || 'Customer',
          note: `10% Referral Bonus from ${bill.customer?.name || 'friend'}'s purchase (Bill #${bill.billNo})`
        });
      }
    }
  });

  // Final calculate wallet balance and sort ledgers chronologically
  Object.values(map).forEach(c => {
    c.walletBalance = Math.max(0, c.directCashbackEarned + c.referralBonusEarned - c.walletRedeemed);
    c.ledger.sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  return Object.values(map);
};

export const getAllWalletAuditTransactions = (bills = []) => {
  const profiles = getCustomerWalletProfiles(bills);
  const allEvents = [];

  profiles.forEach(profile => {
    profile.ledger.forEach(item => {
      allEvents.push({
        ...item,
        customerName: profile.name,
        customerMrd: profile.mrdNo,
        customerPhone: profile.phone
      });
    });
  });

  allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  return allEvents;
};

export const getWalletSummaryMetrics = (bills = []) => {
  const profiles = getCustomerWalletProfiles(bills);

  let totalPoolInCirculation = 0;
  let totalCashbackGiven = 0;
  let totalReferralBonusesGiven = 0;
  let totalRedeemed = 0;
  let activeWalletHolders = 0;
  let totalReferralCount = 0;

  profiles.forEach(p => {
    totalPoolInCirculation += p.walletBalance;
    totalCashbackGiven += p.directCashbackEarned;
    totalReferralBonusesGiven += p.referralBonusEarned;
    totalRedeemed += p.walletRedeemed;
    totalReferralCount += p.referralCount;
    if (p.walletBalance > 0) {
      activeWalletHolders += 1;
    }
  });

  return {
    totalPoolInCirculation,
    totalCashbackGiven,
    totalReferralBonusesGiven,
    totalRedeemed,
    activeWalletHolders,
    totalReferralCount,
    totalCustomers: profiles.length
  };
};

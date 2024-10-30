package com.sadetech.coupon.Service;

import com.sadetech.coupon.Repo.CouponRepository;
import com.sadetech.coupon.model.Coupon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(Long id, Coupon couponDetails) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setType(couponDetails.getType());
        coupon.setDiscountValue(couponDetails.getDiscountValue());
        coupon.setUsageLimit(couponDetails.getUsageLimit());
        coupon.setEnabled(couponDetails.isEnabled()); // Ensure this is correctly set
        coupon.setStartDate(couponDetails.getStartDate());
        coupon.setEndDate(couponDetails.getEndDate());
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }
}

'use client'

import LandingFooter from "./layout/LandingFooter";
import LandingHeader from "./layout/LandingHeader";
import LandingBanner from "./sections/LandingBanner";
import LandingCoreValues from "./sections/LandingCoreValues";
import LandingCreateStoreOnboarding from "./sections/LandingCreateStoreOnboarding";
import LandingReviews from "./sections/LandingReviews";
import LandingSafety from "./sections/LandingSafety";

export default function LandingPageWrapper() {
    return (
        <>
            <LandingHeader />
            <LandingBanner />
            <LandingCoreValues />
            <LandingReviews />
            <LandingSafety />
            <LandingCreateStoreOnboarding />
            <LandingFooter />
        </>
    )
}
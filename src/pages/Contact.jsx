import React from "react"

import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";
import ContactFormSection from "../components/ContactPage/ContactFormSection";
import InfoSection from "../components/ContactPage/InfoSection";

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Form */}
         <InfoSection/>
          <ContactFormSection />

      </div>
      <section className="w-11/12 max-w-maxContentTab lg:max-w-maxContent mx-auto relative my-4 flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <div className="text-center text-4xl font-semibold mt-8">
            Reviews from other learners           
          </div>
          <div className="w-[100%] h-[100%]">
          <ReviewSlider />
          </div>

      </section>
      <Footer />
    </div>
  )
}

export default Contact
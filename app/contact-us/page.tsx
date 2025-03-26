import {Button} from "@/components/ui/button";

export default function ContactUs() {
    return (
        <div className="relative w-full flex justify-center overflow-hidden bg-black z-10">
            <div className="max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-20 py-[200px]">
                <div className="w-full flex justify-center">
                    <div
                        className="text-[45px] md:text-[64px] lg:text-[90px] text-white text-center w-full mb-[15px] lg:mb-[35px] lg:leading-[105px]">
                        Get in <span className="text-theme-crimson">Touch</span> with Omnify
                    </div>
                </div>
                <div
                    className="text-white text-center text-[28px] md:text-[35px] lg:text-[32px] max-w-[675px] w-full mx-auto mb-[70px]">
                    Ready to elevate your gaming tournaments? Reach out to us today!
                </div>
                <div className="w-full max-w-[600px] mx-auto bg-white/10 p-8 rounded-lg">
                    <form className="flex flex-col gap-6">
                        <div>
                            <label className="text-white text-[16px] mb-2 block">Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full p-3 bg-white/5 text-white rounded-md border border-white/20"
                            />
                        </div>
                        <div>
                            <label className="text-white text-[16px] mb-2 block">Email</label>
                            <input
                                type="email"
                                placeholder="Your Email Address"
                                className="w-full p-3 bg-white/5 text-white rounded-md border border-white/20"
                            />
                        </div>
                        <div>
                            <label className="text-white text-[16px] mb-2 block">Subject</label>
                            <input
                                type="text"
                                placeholder="What’s on Your Mind?"
                                className="w-full p-3 bg-white/5 text-white rounded-md border border-white/20"
                            />
                        </div>
                        <div>
                            <label className="text-white text-[16px] mb-2 block">Inquiry Type</label>
                            <select className="w-full p-3 bg-white/5 text-white rounded-md border border-white/20">
                                <option value="general">General Inquiry</option>
                                <option value="support">Technical Support</option>
                                <option value="partnership">Partnership Opportunities</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-white text-[16px] mb-2 block">Message</label>
                            <textarea
                                placeholder="Tell Us More"
                                className="w-full p-3 bg-white/5 text-white rounded-md border border-white/20 h-[150px]"
                            ></textarea>
                        </div>
                        <Button className="h-[48px] w-full text-[16px] bg-theme-crimson hover:bg-theme-crimson/90">
                            Submit
                        </Button>
                    </form>
                </div>
                <div className="mt-[70px] text-center">
                    <div className="text-white text-[24px] mb-[25px]">Direct Contact</div>
                    <div className="text-muted-white text-[16px] max-w-[600px] mx-auto">
                        <p><strong>Technical Support:</strong> <a href="mailto:support@omnify.com"
                                                                  className="underline">support@omnify.com</a></p>
                        <p className="mt-2"><strong>Partnership Inquiries:</strong> <a href="mailto:partners@omnify.com"
                                                                                       className="underline">partners@omnify.com</a>
                        </p>
                        <p className="mt-2"><strong>Media and Press:</strong> <a href="mailto:press@omnify.com"
                                                                                 className="underline">press@omnify.com</a>
                        </p>
                    </div>
                </div>
                <div className="mt-[70px] text-center">
                    <div className="text-white text-[24px] mb-[25px]">Connect with Us</div>
                    <div className="flex justify-center gap-[20px] flex-wrap">
                        <a href="https://twitter.com/OmnifyGaming" target="_blank"
                           className="text-muted-white text-[16px] hover:text-theme-crimson">
                            Twitter: @OmnifyGaming
                        </a>
                        <a href="https://discord.gg/omnify" target="_blank"
                           className="text-muted-white text-[16px] hover:text-theme-crimson">
                            Discord: discord.gg/omnify
                        </a>
                        <a href="https://linkedin.com/company/omnify" target="_blank"
                           className="text-muted-white text-[16px] hover:text-theme-crimson">
                            LinkedIn: Omnify
                        </a>
                    </div>
                </div>
                <div className="mt-[70px] text-center">
                    <div className="text-white text-[24px] mb-[25px]">Need Help?</div>
                    <div className="text-muted-white text-[16px] max-w-[600px] mx-auto">
                        <p>
                            <a href="#" className="underline hover:text-theme-crimson">Help Center</a>: Find quick
                            answers to common questions.
                        </p>
                        <p className="mt-2">
                            <a href="#" className="underline hover:text-theme-crimson">Blog</a>: Stay updated with tips
                            and guides.
                        </p>
                    </div>
                </div>
                <div className="mt-[50px] text-center text-muted-white text-[14px]">
                    Your privacy matters. Any information you share will be used only to respond to your inquiry and
                    won’t be shared with third parties.
                </div>
            </div>
            <img
                src="/assets/images/bg/contact-bg.png"
                alt="contact-bg"
                className="absolute bottom-0 left-0 w-full z-10"
            />
        </div>
    );
}
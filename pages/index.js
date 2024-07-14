import React from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { LampContainer } from "../components/ui/lamp";

const spotlight = () => {
  return (
    <>
      <Head>
        <title>Justice Minds | Home</title>
        <link href="/assets/css/style.css" rel="stylesheet"></link>
      </Head>
      <div class="c5z2i cyndk chtv9 c3wgq">
        <header class="cnh8i c3nel c01bk">
          <div class="c1om1 cve7d c2knu cryui cmboy">
            <div class="c3nxx c8ug7 cwiz5 c3wgq cqctx">
              <div class="c1f4m c8e4r cy8j7">
                {/* <!-- Logo --> */}
                <a
                  class="c8ug7 ckz2n c3wgq"
                  href="index.html"
                  aria-label="Cruip"
                >
                  {/* <img class="cb8ym" src="images/logo.jpg" width="32" height="32" alt="Mary Rutt" />
                            <span class="c1zc3 ceykk cgmti">Mary Rutt</span> */}
                </a>
              </div>

              {/* <!-- Right side --> */}
              <div class="cb0b0 c3wgq cjhcr">
                {/* <!-- Light switch --> */}
                {/* <div class="cdl7m chtv9 c3wgq">
                            <input type="checkbox" name="light-switch" id="light-switch" class="light-switch chsm6 ccnbn" />
                            <label class="ctvap cnvgl cnm79 cabny c39l6 ci9vu cnck3 c4k4g c40y7 cd0o4 cs9if ci0lp cdl7m c8ug7 cb8ym cj25x cty4y c4oh8 c95b3 cgihz ckuce cqrkk cw2jy" for="light-switch">
                                <svg class="c4cjc" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                    <path class="c4s1c c16pd" d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z"></path>
                                    <path class="c4q0w c7yej" d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z"></path>
                                </svg>
                                <svg class="cxu3o cf0yw" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                    <path class="c7yej" d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z"></path>
                                    <path class="c16pd" d="M12.5 5a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 5Z"></path>
                                </svg>
                                <span class="chsm6">Switch to light / dark version</span>
                            </label>
                        </div> */}
              </div>
            </div>
          </div>
        </header>

        <div class="clz1d chtv9 c3wgq cjhcr">
          {/* <!-- Left side --> */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            class="cvidh cz3i2 c06d3 cj25x ckv2c ca5uj c1f4m c95b3 c3nel animate animate-in"
          >
            {/* <!-- Background Illustration --> */}
            <div
              class="c3gpz c1osd cvvie cmatm cnh8i crp9m cfxzy"
              aria-hidden="true"
            >
              <img
                class="c3stl"
                src="/assets/images/bg-illustration.svg"
                width="785"
                height="685"
                alt="Bg illustration"
              />
            </div>
            <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 200 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="sm:-mt-10 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        <img src="/logomain.png" className="mt-2" alt="image" width={"400px"} />
      </motion.h1>
    </LampContainer>
            {/* <div class="clkia cw17b c54n8 cve7d chtv9 c2knu cryui c3nel cl0qm cdv0q c3wgq cmboy">
              
              <div class="cdl7m chtv9 c3wgq cjhcr items-center">
                
                <div class="cfnv8">
                
                  <img src="/logomain.png" alt="image" width={"400px"} />
                  
                </div>
              </div>
            </div> */}
          </motion.div>

          {/* <!-- Right side --> */}
          
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            class="cacuu c36e2 ca5uj chtv9 c3nel c3wgq"
          >
            <iframe src="https://benmak9.craft.me/KUkh6zqtDVH56K" width={"100%"} className="sm:h-[100vh] h-[1000px]">

</iframe>
            {/* <!-- Page content --> */}
            {/* <div class="con84 c9b8i cve7d c2knu cryui c3nel csh0a cjhcr cmboy">
              <article class="c0k7l cvdyv czhfe cnxmv ckqb6">
                <section class="clkj5">
                  <h2 class="cse8i coexk c9a7b text-yellow-500 text-[30px]">
                    THE MISSION OF JUSTICE MINDS
                  </h2>
                  <br />
                  <div class="cxzkm ck3dd ca0rk">
                    Our mission is to serve the dual goals of upholding justice
                    and empowering society through scrupulously evidence-based
                    advocacy. We pursue this mission as a non-profit foundation
                    working to establish democratic governance reaching
                    international advisory for council, comprising prospective
                    jurists, scientists, and community leaders. <br />
                    <br />
                    This council will provide guidance and help ensure we lay
                    the groundwork for participatory, representative leadership,
                    operating on a foundation of procedural rigor, analytic
                    integrity, and transparency at every level of our work.
                  </div>
                  <img src="/lawimg.png" className="object-fit mt-5 mb-2" style={{borderRadius:"10px"}} alt="" />
                </section>
                <section class="clkj5">
                  <h2 class="cse8i coexk c9a7b text-yellow-500 ">
                    THE PILLARS OF OUR APPROACH
                  </h2>
                  <br />
                  <h3 class="cse8i coexk c9a7b">Facts & Evidence</h3>

                  <div class="cxzkm ck3dd ca0rk">
                    We define facts through impartial, standardised data
                    collection methods - respecting ethical and privacy norms
                    that must become more centralised and understood to
                    professionals and the public. <br /> <br /> Public trust is
                    paramount, whilst also respecting the challenges incurred by
                    professionals in a position of trust, collectively we wish
                    to establish a collective trust in any information-based
                    work.
                  </div>
                  <br />
                  <h3 class="cse8i coexk c9a7b">Accuracy & Objectivity</h3>

                  <div class="cxzkm ck3dd ca0rk">
                    Our analysis prioritises consistency, reproducibility, and
                    impartiality above all else through specialised
                    technological and multi-phased human review combined with
                    AI.I = "Artificial Intelligence with integrity." <br />{" "}
                    <br /> Which is data containers of established credible
                    academia, scientific and psychological literature
                    continually seeking and growing independent ethics boards
                    tht evaluates the fairness of AI.I models and adjudicates
                    any stakeholder concerns.
                  </div>
                  <br />
                  <h3 class="cse8i coexk c9a7b">Multi-perspectivity</h3>

                  <div class="cxzkm ck3dd ca0rk">
                  We solicit broad contributions, data triangulation, cross corroboration and integrate diverse viewpoints into our fully-documented, modular analytical framework to arrive at optimally balanced outcomes. Data-driven information powers our priorities and policy adjustments.
                  </div>
                  
                </section>
                <section class="clkj5">
                  <style>
                    {`th, td {
  border: none; 
  padding: 0.75rem;
}`}
                  </style>
                  <h2 class="cse8i coexk c9a7b text-yellow-500 ">
                    EXCLUSIVE SERVICES
                  </h2>
                  <br />
                  <ul class="cbqix cf7br cw4am c0qtv">
                    <li class="   cv4zd cd8bd cli3j ce914 cqtii bg-gradient-to-tr from-[#1c1c1c] to-[#1d1d1d]">
                      <div class="c1zc3 c0rza">Legal OBE Consultation</div>
                      <div class="clsju">Expert Advice</div>
                    </li>
                    <li class="   cv4zd cd8bd cli3j ce914 cqtii bg-gradient-to-tr from-[#1c1c1c] to-[#1d1d1d]">
                      <div class="c1zc3 c0rza">AI Ethics & Fact Audits</div>
                      <time class="clsju">Integrity Checks</time>
                    </li>
                    <li class="   cv4zd cd8bd cli3j ce914 cqtii bg-gradient-to-tr from-[#1c1c1c] to-[#1d1d1d]">
                      <div class="c1zc3 c0rza">Data Governance Training</div>
                      <time class="clsju">Empower Learning</time>
                    </li>
                  </ul>
                </section>
                <section class="clkj5">
                  <h2 class="cse8i coexk c9a7b text-yellow-500">
                    FEATURES & PLANS
                  </h2>
                  <br />
                  <div class="cmk4y">
                    <table class="crktv cf7br c3nel">
                      <thead class="chsm6">
                        <tr>
                          <th>Description</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class=" ceyck ckzi6 cbk2s bg-gradient-to-tr from-[#1c1c1c] to-[#1d1d1d]">
                          <th
                            scope="row"
                            class="cwoqp c200e ci57k c82ek c1zux c7hd0 csyf2 ccmto cm02q cb9a1 c9a2m cejkp ci4c2 cy3zg c95b3 cmboy cwapv"
                          >
                            <div class="cse8i c0269">
                              <a
                                class="cv7r7 cf2k0 c7z6t cmv25"
                                href="/features/clientdashboard"
                              >
                                Client Dashboard
                              </a>
                            </div>
                            <p class="cxzkm ck3dd">
                              Includes Emails, WhatsApps, Call Recordings,
                              Evidences.
                            </p>
                          </th>
                          <td class="cs5fy cpeoy czdqr c6wt9 csg48 c510c ce1a7 cl43r ctazt cotlx cxhrl c7hd0 c05fa cc5np csyf2 cmj6x chq6w cu92t cur3d ccmto cvjx5 cpdog cse8i c4mgb cc604 c4xcz ctcb3 c95b3 cmboy cwapv">
                            <a
                              class="cvxez cbzwq cv7r7 cf2k0 c7z6t cmv25 text-[14px]"
                              href="/features/clientdashboard"
                              tabindex="-1"
                            >
                              80% Progress
                            </a>
                          </td>
                        </tr>
                        <tr class="cd8hs c0ad6 c3ynp ceyck ckzi6 cbk2s">
                          <th
                            scope="row"
                            class="c7hd0 csyf2 c9a2m cy3zg c95b3 cmboy cwapv"
                          >
                            <div class="cse8i c0269">
                              <a
                                class="cv7r7 cf2k0 c7z6t cmv25"
                                href="/features/clientdashboard"
                              >
                                Legal Agencies
                              </a>
                            </div>
                            <p class="cxzkm ck3dd">
                              Full working content management system
                            </p>
                          </th>
                          <td class="cs5fy cpeoy czdqr c6wt9 csg48 c510c ce1a7 cl43r ctazt cotlx cxhrl c7hd0 c05fa cc5np csyf2 cmj6x chq6w cu92t cur3d ccmto cvjx5 cpdog cse8i c4mgb cc604 c4xcz ctcb3 c95b3 cmboy cwapv">
                            <a
                              class="cvxez cbzwq cv7r7 cf2k0 c7z6t cmv25 text-[14px]"
                              href="/features/clientdashboard"
                              tabindex="-1"
                            >
                              Ready to Launch
                            </a>
                          </td>
                        </tr>
                        <tr class=" ceyck ckzi6 cbk2s bg-gradient-to-tr from-[#1c1c1c] to-[#1d1d1d]">
                          <th
                            scope="row"
                            class="cwoqp c200e ci57k c82ek c1zux c7hd0 csyf2 ccmto cm02q cb9a1 c9a2m cejkp ci4c2 cy3zg c95b3 cmboy cwapv"
                          >
                            <div class="cse8i c0269">
                              <a
                                class="cv7r7 cf2k0 c7z6t cmv25"
                                href="/features/clientdashboard"
                              >
                                Collaborative Chats
                              </a>
                            </div>
                            <p class="cxzkm ck3dd">
                              Add Clients for a public chat in realtime.
                            </p>
                          </th>
                          <td class="cs5fy cpeoy czdqr c6wt9 csg48 c510c ce1a7 cl43r ctazt cotlx cxhrl c7hd0 c05fa cc5np csyf2 cmj6x chq6w cu92t cur3d ccmto cvjx5 cpdog cse8i c4mgb cc604 c4xcz ctcb3 c95b3 cmboy cwapv">
                            <a
                              class="cvxez cbzwq cv7r7 cf2k0 c7z6t cmv25 text-[14px]"
                              href="/features/clientdashboard"
                              tabindex="-1"
                            >
                              DONE
                            </a>
                          </td>
                        </tr>
                        <tr class="cd8hs c0ad6 c3ynp ceyck ckzi6 cbk2s">
                          <th
                            scope="row"
                            class="c7hd0 csyf2 c9a2m cy3zg c95b3 cmboy cwapv"
                          >
                            <div class="cse8i c0269">
                              <a
                                class="cv7r7 cf2k0 c7z6t cmv25"
                                href="/features/clientdashboard"
                              >
                                Data Handling Tools
                              </a>
                            </div>
                            <p class="cxzkm ck3dd">
                              Includes transcripts, fact checks, audio enhancer,
                              etc
                            </p>
                          </th>
                          <td class="cs5fy cpeoy czdqr c6wt9 csg48 c510c ce1a7 cl43r ctazt cotlx cxhrl c7hd0 c05fa cc5np csyf2 cmj6x chq6w cu92t cur3d ccmto cvjx5 cpdog cse8i c4mgb cc604 c4xcz ctcb3 c95b3 cmboy cwapv">
                            <a
                              class="cvxez cbzwq cv7r7 cf2k0 c7z6t cmv25 text-[14px]"
                              href="/features/clientdashboard"
                              tabindex="-1"
                            >
                              Planned
                            </a>
                          </td>
                        </tr>
                        <tr class=" ceyck ckzi6 cbk2s bg-gradient-to-tr from-[#1c1c1c] to-[#1d1d1d]">
                          <th
                            scope="row"
                            class="cwoqp c200e ci57k c82ek c1zux c7hd0 csyf2 ccmto cm02q cb9a1 c9a2m cejkp ci4c2 cy3zg c95b3 cmboy cwapv"
                          >
                            <div class="cse8i c0269">
                              <a
                                class="cv7r7 cf2k0 c7z6t cmv25"
                                href="/features/clientdashboard"
                              >
                                Fact Reporting with AI and Data Analysis
                              </a>
                            </div>
                            <p class="cxzkm ck3dd">
                              Through data analytics and visualization charts
                              with AI and fact based evidences
                            </p>
                          </th>
                          <td class="cs5fy cpeoy czdqr c6wt9 csg48 c510c ce1a7 cl43r ctazt cotlx cxhrl c7hd0 c05fa cc5np csyf2 cmj6x chq6w cu92t cur3d ccmto cvjx5 cpdog cse8i c4mgb cc604 c4xcz ctcb3 c95b3 cmboy cwapv">
                            <a
                              class="cvxez cbzwq cv7r7 cf2k0 c7z6t cmv25 text-[14px]"
                              href="/features/clientdashboard"
                              tabindex="-1"
                            >
                              50% Progress
                            </a>
                          </td>
                        </tr>
                        
                      </tbody>
                      
                    </table>
                  </div>
                </section>
                
                
              </article>
            </div> */}
            {/* <!-- Call to action --> */}
            <div class="co13m cc9s4 c5bmk ca5uj c7k6n ciqx9 c3nel c1bvx c01bk">
              <div class="cve7d c2knu cryui c3nel cmboy">
                <div class="ckz2n cfbl1 c3wgq cqtii">
                  <a
                    class="cnvgl cl2gl ci9vu cy976 c60cz cs9if cqls2 ciqx9 c3nel ckuce cy34g hover:bg-gray-600 bg-gray-800"
                    href="https://www.justice-minds.com/agency/About%20Us%20id=0ce983a2-089c-48fe-97ac-f71054fa3bce"
                  >
                    About Us
                  </a>
                  <a
                    class=" c0kcv cnzrq cl7to cs9if csepm cx2jt c25ay c3nel ckuce cy34g hover:bg-gray-600 bg-gray-800"
                    href="mailto:consult@legaldueprocess.com"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default spotlight;

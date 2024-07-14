import Head from 'next/head'
import React from 'react'
import { motion } from "framer-motion";
const clientdashboard = () => {
  return (
    <>
      <Head>
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
            transition={{ duration: 0.5 }}
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

            <div class="clkia cw17b c54n8 cve7d chtv9 c2knu cryui c3nel cl0qm cdv0q c3wgq cmboy">
              <div class="cdl7m chtv9 c3wgq cjhcr items-center">
                <div class="cfnv8">
                  <img src="/logomain.png" alt="image" width={"400px"} />
                  {/* <div class="cj6wo ceykk ckwqs">Quote for</div>
                            <h1 class="ca8f3 c25ay cn4ul c1p4p">The Markyk Corp.</h1>
                            <time class="before:content-['—_'] c0da4 clsju ceykk cgmti cntvh">20 April, 2024</time> */}
                </div>
              </div>
            </div>
          </motion.div>

          {/* <!-- Right side --> */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            class="cacuu c36e2 ca5uj chtv9 c3nel c3wgq"
          >
            {/* <!-- Page content --> */}

            <div className="cryui c3nel cve7d cjhcr cmboy csh0a c2knu con84 c9b8i">
  {/* Back button */}
  <div className="c2g3a cp1ev c4ovs cuoln cp8ig">
    <a
      className="c95b3 c4oh8 cqrkk cw2jy ci0lp c8ug7 cdl7m cb8ym cgihz c60cz ciqx9 ckuce cs9if c40y7 cl2gl ci9vu c4k4g cnvgl"
      href="/"
    >
      <svg width={12} height={10} xmlns="http://www.w3.org/2000/svg">
        <path
          className="chpsw"
          d="m5.94 10 1.05-.959-3.645-3.344H11.5V4.303H3.345L6.99.954 5.94 0 .5 5z"
        />
      </svg>
      <span className="chsm6">Back to Home</span>
    </a>
  </div>
  <article>
    <h2 className="c79zg ckqb6 ca8f3">Client Dashboard</h2>
    <div className="ca0rk ck3dd cxzkm">
      <p>
        The discovery phase is an essential part of my design process where I
        delve into every aspect of the product{" "}
        <strong className="c0rza cqls2 cy976">
          to gain a comprehensive understanding
        </strong>
        . It involves conducting extensive research and analysis to gather
        insights that lay the groundwork for the entire design journey.
      </p>
      <p>
        During this phase, I explore various elements such as the competition,
        market dynamics, and current challenges to inform my design decisions.
        Here's what the discovery phase typically includes:
      </p>
      <ul className="ca0rk">
        <li className="before:content-['✴︎'] c3wgq c8ug7 cro1j c4o70">
          These objectives are derived from user insights, align with the
          client's goals, and provide solutions to the identified challenges.
        </li>
        <li className="before:content-['✴︎'] c3wgq c8ug7 cro1j c4o70">
          These objectives are derived from user insights, align with the
          client's goals, and provide solutions to the identified challenges.
        </li>
      </ul>
      <p>
        First and foremost, I immerse myself in understanding my client's vision
        and project goals. By closely collaborating with the client,{" "}
        <strong className="c0rza cqls2 cy976">
          I ensure a clear understanding of their requirements and expectations
          for the product
        </strong>
        . This sets the foundation for the design process 👇
      </p>
      <figure className="cm1n2">
        <img
          className="c4cjc"
          src="./images/details-image-light.png"
          width={628}
          height={253}
          alt="Post details light"
        />
        <img
          className="cf0yw cxu3o"
          src="/ogimage.png"
          width={628}
          height={253}
          alt="Post details dark"
        />
        <figcaption className="cw8x3 c1y31 cggwu cgd5g">
          The three pillars of a successful competitive analysis phase.
        </figcaption>
      </figure>
      <p>
        By conducting a thorough discovery phase, I establish a solid foundation
        for the subsequent stages of the design process.{" "}
        <strong className="c0rza cqls2 cy976">
          This phase equips me with the necessary knowledge
        </strong>{" "}
        about the product's context, market landscape, user needs, and design
        objectives.
      </p>
      <p>
        With this understanding, I can move forward confidently into the
        ideation, concept development, and prototyping phases, knowing that my
        designs are rooted in a deep understanding of the product and its users.
      </p>
    </div>
  </article>
</div>


            
          </motion.main>
        </div>
      </div>
    </>
  )
}

export default clientdashboard
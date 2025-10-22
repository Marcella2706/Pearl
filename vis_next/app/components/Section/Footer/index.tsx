import Image from 'next/image';
import qr_code from '../../../../public/svgs/qr_code.svg';
import ic_copyright from '../../../../public/svgs/copyright.svg';

const linksArr = [
  {
    title: 'About us',
    links: ['Our Company', 'Careers', 'Press kits'],
  },
  {
    title: 'Legal',
    links: ['Terms of use', 'Privacy policy', 'About us'],
  },
  {
    title: 'Support',
    links: ['Contact us', 'FAQ'],
  },
];

const Footer = () => {
  return (
    <footer className="pt-72 min-h-screen">
      <div className="w-[90%] max-w-[1440px] mx-auto flex flex-col gap-15 md:gap-10">
        {/* Footer Logo */}
        <div className="md:w-[13.2rem] md:h-[5.6rem]">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Jivika logo"
              priority
              height={90}
              width={90}
              className="rounded-full"
            />
            <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight text-secondary">
              Jivika
            </h2>
          </div>
        </div>

        <div className="flex flex-col pt-15 pb-13 border-y-neutral-500 border-secondly gap-13">
          {/* Keep QR + Nav in a single row on md+ screens */}
          <div className="flex justify-between w-full gap-8 md:flex-row md:gap-14 items-start flex-wrap md:flex-nowrap">
            {/* QR block: allow it to keep a fixed width but not force others to wrap */}
            <div className="flex-none w-80 md:w-68 p-5 rounded-lg border border-dashed border-secondly flex items-center gap-3 mr-80">
              <div className="shrink-0">
                <Image src={qr_code} alt="qr_code" />
              </div>
              <div className="flex flex-col gap-4">
                <p className="max-w-78.25 text-xl md:text-base font-normal text-secondary">
                  Our Portfolios
                </p>
              </div>
            </div>

            {/* Footer Navigation: 3 columns on desktop, collapses responsively */}
            <nav className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {linksArr.map((l, i) => (
                  <div
                    key={i}
                    // allow the column to shrink (min-w-0) so flex can keep everything on one row
                    className="min-w-0 w-full flex flex-col items-start gap-4"
                  >
                    <h3 className="text-lg font-semibold text-secondary">{l.title}</h3>
                    <ul className="list-none flex flex-col gap-3">
                      {l.links.map((link, idx) => (
                        <li
                          key={idx}
                          className="text-secondly text-base font-normal cursor-pointer relative group transition-colors hover:text-foreground"
                        >
                          {link}
                          <span className="absolute left-0 bottom-[-5px] w-0 h-px bg-foreground transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:w-full"></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base md:text-sm font-normal text-secondly">
              <Image src={ic_copyright} alt="copyright svg" className="w-4 h-4" />
              <span>Jivika 2025. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

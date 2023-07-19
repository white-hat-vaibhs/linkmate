import { QRCode } from "react-qrcode-logo";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/helper/supabaseClient";
import { toSvg } from "html-to-image";

export default function Generator() {
  const [links, setLinks] = useState([]);
  const qrCodeRefs = useRef({});

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase.from("links").select("*");
        if (error) {
          throw error;
        }
        setLinks(data);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    fetchLinks();
  }, []);

  const handleDownloadQRCode = async (link) => {
    try {
      const qrCodeContainer = qrCodeRefs.current[link.id];

      // Generate the QR code image with the correct URL
      const svgDataURL = await toSvg(qrCodeContainer);

      // Create a temporary link element
      const downloadLink = document.createElement("a");
      downloadLink.href = svgDataURL;
      downloadLink.download = `${link.name}.svg`;

      // Trigger the download
      downloadLink.click();
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const setQrCodeRef = (linkId, ref) => {
    qrCodeRefs.current[linkId] = ref;
  };

  return (
    <div>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-7">
              Links List
            </h2>
            <div className="relative py-1 text-sm text-gray-600">
              Instruction
            </div>
          </div>

          <div className="mx-auto mt-10">
            {links.map((link) => (
              <div
                key={link.id}
                className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
              >
                <h3 className="text-lg font-bold tracking-tight text-gray-900">
                  {link.name}
                </h3>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                  {link.link}
                </p>

                <div ref={(ref) => setQrCodeRef(link.id, ref)}>
                  {/* <QRCode value={link.link} /> */}
                  <QRCode
                    value={link.link}
                    logoImage="https://npstoday.blob.core.windows.net/images/b1d0cd86-5f9c-420f-8d7e-3064dd0cd20c/adc5424d-f0e7-4bc2-a43b-9304cc17f4cc_wide.png"
                    logoWidth="90"
                    logoHeight="20"
                    size="200"
                    removeQrCodeBehindLogo
                    eyeColor="#000"
                    qrStyle="dots"
                    ecLevel="H"
                    eyeRadius={[
                      {
                        // top/left eye
                        outer: [15, 15, 0, 15],
                        inner: [15, 15, 0, 15]
                      },
                      [15, 15, 15, 0], // top/right eye
                      [15, 0, 15, 15] // bottom/left
                    ]}
                  />
                </div>
                <button
                  onClick={() => handleDownloadQRCode(link)}
                  className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Download QR Code (SVG)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export const SocialMedia: React.FC = () => {
  const socialImages = [
    "https://api.builder.io/api/v1/image/assets/TEMP/f3d555a70a10fb610b1d02952c0a13259ba2ff09?placeholderIfAbsent=true",
    "https://api.builder.io/api/v1/image/assets/TEMP/794b7359d1c5731f437fc3ed4cca0dc31282b076?placeholderIfAbsent=true",
    "https://api.builder.io/api/v1/image/assets/TEMP/891208d83bdcb726ba1a2d9772f467f5ad829f27?placeholderIfAbsent=true",
    "https://api.builder.io/api/v1/image/assets/TEMP/a6565ff76e0d51ccba072c472d66b0191a460007?placeholderIfAbsent=true",
    "https://api.builder.io/api/v1/image/assets/TEMP/2fd8c75e6bcc40c3be1ae7431f924de5a23f1d7b?placeholderIfAbsent=true"
  ];

  return (
    <section className="bg-white flex w-full flex-col">
      <div className="bg-[rgba(240,186,29,1)] flex w-full flex-col items-center text-xl text-neutral-800 font-medium justify-center mt-[167px] px-[70px] py-[29px] max-md:max-w-full max-md:mt-10 max-md:px-5">
        <p className="max-md:max-w-full">
          <span className="font-normal">Siga nossas</span>{" "}
          <span className="font-bold">Redes Sociais</span>{" "}
          <span className="font-normal">e fique por dentro das</span>
          <span className="font-bold"> Novidades</span>
        </p>
      </div>
      <div className="flex items-stretch flex-wrap">
        {socialImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Social media post ${index + 1}`}
            className="aspect-[1] object-contain w-[341px] shrink-0 max-w-full hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        ))}
      </div>
    </section>
  );
};

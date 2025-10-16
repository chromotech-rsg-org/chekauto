import React from 'react';

interface ProductCardProps {
  title: string;
  image: string;
  buttonText?: string;
  onContract?: () => void;
  onShowDetails?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  buttonText = "CONTRATAR",
  onContract,
  onShowDetails
}) => {
  return (
    <article className="border flex w-full flex-col items-center px-[31px] py-[29px] rounded-[0px_0px_8px_8px] border-[rgba(204,204,204,1)] border-solid max-md:mt-10 max-md:px-5">
      <h3 className="text-[rgba(22,28,45,1)] text-xl font-semibold leading-[25px] text-center min-h-[50px] flex items-center">
        {title}
      </h3>
      <img
        src={image}
        alt={title}
        className="aspect-[1.4] object-contain w-full self-stretch mt-9"
      />
      <div className="flex w-[59px] items-stretch gap-[13px] mt-[22px]">
        <div className="bg-[rgba(240,186,29,1)] flex w-2.5 shrink-0 h-2.5 rounded-[50%]" />
        <div className="border flex w-[11px] shrink-0 h-[11px] rounded-[50%] border-[rgba(174,174,174,1)] border-solid" />
        <div className="border flex w-[11px] shrink-0 h-[11px] rounded-[50%] border-[rgba(174,174,174,1)] border-solid" />
      </div>
      <button
        onClick={onContract}
        className="rounded bg-[rgba(240,186,29,1)] self-stretch flex flex-col items-center text-base text-black font-semibold text-center leading-loose mt-5 pt-3.5 pb-[23px] px-[70px] hover:bg-[rgba(220,166,9,1)] transition-colors max-md:px-5"
      >
        {buttonText}
      </button>
      <button
        onClick={onShowDetails}
        className="text-black text-sm font-medium leading-[25px] text-center underline mt-[17px] hover:text-[rgba(240,186,29,1)] transition-colors"
      >
        Mostrar detalhes
      </button>
    </article>
  );
};

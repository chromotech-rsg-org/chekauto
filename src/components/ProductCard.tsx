import React from 'react';
import { useNavigate } from 'react-router-dom';
interface ProductCardProps {
  id?: string;
  title: string;
  image: string;
  buttonText?: string;
  onContract?: () => void;
  onShowDetails?: () => void;
}
export const ProductCard: React.FC<ProductCardProps> = ({
  id = '1',
  title,
  image,
  buttonText = "CONTRATAR",
  onContract,
  onShowDetails
}) => {
  const navigate = useNavigate();
  const handleContract = () => {
    if (onContract) {
      onContract();
    } else {
      navigate(`/produto/${id}`);
    }
  };
  const handleShowDetails = () => {
    if (onShowDetails) {
      onShowDetails();
    } else {
      navigate(`/produto/${id}`);
    }
  };
  return <article className="border flex w-full flex-col items-center px-[31px] py-[29px] rounded-[0px_0px_8px_8px] border-[rgba(204,204,204,1)] border-solid max-md:mt-10 max-md:px-5 min-h-[450px]">
      <h3 className="text-[rgba(22,28,45,1)] text-xl font-semibold leading-[25px] text-center min-h-[50px] flex items-center">
        {title}
      </h3>
      <img src={image} alt={title} className="aspect-[1.4] object-contain w-full self-stretch mt-9" />
      <div className="flex w-[59px] items-stretch gap-[13px] mt-[22px]">
        <div className="bg-[rgba(240,186,29,1)] flex w-2.5 shrink-0 h-2.5 rounded-[50%]" />
        <div className="border flex w-[11px] shrink-0 h-[11px] rounded-[50%] border-[rgba(174,174,174,1)] border-solid" />
        <div className="border flex w-[11px] shrink-0 h-[11px] rounded-[50%] border-[rgba(174,174,174,1)] border-solid" />
      </div>
      <button onClick={handleContract} className="rounded bg-brand-yellow self-stretch flex flex-col items-center text-base text-black font-semibold text-center leading-loose mt-5 pt-3.5 pb-[23px] px-[70px] hover:bg-brand-yellow-dark transition-colors max-md:px-5 bg-amber-500 hover:bg-amber-400">
        {buttonText}
      </button>
      <button onClick={handleShowDetails} className="text-black text-sm font-medium leading-[25px] text-center underline mt-[17px] hover:text-brand-yellow transition-colors">
        Mostrar detalhes
      </button>
    </article>;
};
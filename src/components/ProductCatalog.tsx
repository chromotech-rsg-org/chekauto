import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { useNavigate } from 'react-router-dom';
import logoBlack from '@/assets/logo-chekauto-black.png';

export const ProductCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Guindastes / Plataformas');

  const categories = [
    'Carrocerias',
    'Tanques', 
    'Guindastes / Plataformas',
    'Basculantes e Especiais',
    'Mecanismos Operacionais'
  ];

  const productSections = [
    {
      title: "Categoria Carroceria | Saiba mais",
      products: [
        {
          id: '1',
          title: "APELIDO",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/cfb51224434091975b619cc78f7cda7d80dc5a8f?placeholderIfAbsent=true"
        },
        {
          id: '2',
          title: "APELIDO", 
          image: "https://api.builder.io/api/v1/image/assets/TEMP/2e5e9beeb00ba17a134a7bb05a70abb9c13107a2?placeholderIfAbsent=true"
        },
        {
          id: '3',
          title: "APELIDO",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/133f93ef3054cf83dedb089a07dc54904eb11754?placeholderIfAbsent=true"
        }
      ]
    },
    {
      title: "Categoria Carroceria | Saiba mais",
      products: [
        {
          id: '4',
          title: "CARROCERIA SOBRE CHASSI CANAVIEIRO",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/cfa86dd59782494ea7d59f5c3edcad81b1d5dbaa?placeholderIfAbsent=true"
        },
        {
          id: '5',
          title: "CARROCERIA SOBRE CHASSI CARGA SECA/CESTO AÉREO",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/42305900c8a73bda71f9b4cb783b72398fbd3593?placeholderIfAbsent=true",
          buttonText: "CONTRATAR DOCUMENTAÇÃO"
        },
        {
          id: '6',
          title: "CARROCERIA SOBRE CHASSI COMERCIAL (FOOD TRUCK)",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/faa9c0b7c62d9c32ce24b70b603315a0e3b55fea?placeholderIfAbsent=true"
        }
      ]
    },
    {
      title: "Categoria Carroceria | Saiba mais",
      products: [
        {
          id: '7',
          title: "CARROCERIA SOBRE CHASSI GAIOLA DE GÁS",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/5b746b5676cd8d6068299c00118a9b00a3749d62?placeholderIfAbsent=true"
        },
        {
          id: '8',
          title: "CARROCERIA SOBRE CHASSI GRANELEIRO",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/da91382a14fe4976fa9cdc28a8653508383223ff?placeholderIfAbsent=true"
        },
        {
          id: '9',
          title: "CARROCERIA SOBRE CHASSI LONADO",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/c1d1fc69dfdd4b1a140f4f960f47213c0ac36ac0?placeholderIfAbsent=true"
        }
      ]
    },
    {
      title: "Categoria Carroceria | Saiba mais",
      products: [
        {
          id: '10',
          title: "CARROCERIA SOBRE CHASSI SILO",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/76fb71ba073ff6e03f53c3ef9e90af4e5c0f5f9c?placeholderIfAbsent=true"
        },
        {
          id: '11',
          title: "CARROCERIA SOBRE CHASSI TANQUE",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/cfb51224434091975b619cc78f7cda7d80dc5a8f?placeholderIfAbsent=true"
        },
        {
          id: '12',
          title: "CARROCERIA SOBRE CHASSI TANQUE PRODUTO PERIGOSO",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/4cd14e37528625adf9a884246b28a146ce7c21fb?placeholderIfAbsent=true"
        }
      ]
    },
    {
      title: "Categoria Carroceria | Saiba mais",
      products: [
        {
          id: '13',
          title: "MUNCK",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/d429cab8989b59a597a0ddb9e46d8d47bf96bca9?placeholderIfAbsent=true"
        },
        {
          id: '14',
          title: "PLATAFORMA AUTO SOCORRO",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/7dbffe42059a7130ece249312148d9f97174b9e6?placeholderIfAbsent=true"
        },
        {
          id: '15',
          title: "POLIGUINDASTE",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/3b6c784e3cad2225b77c6c966fd175254d714212?placeholderIfAbsent=true"
        }
      ]
    },
    {
      title: "Categoria Carroceria | Saiba mais",
      products: [
        {
          id: '16',
          title: "ROLL ON ROLL OFF",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/ed99a10cf51d005233a771e9f0a7ce65e8ac486a?placeholderIfAbsent=true"
        },
        {
          id: '17',
          title: "PRANCHA COM MECANISMO OPERACIONAL",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/2418532954636ae67ec55e7d57347cfbd6f6edde?placeholderIfAbsent=true"
        },
        {
          id: '18',
          title: "BASCULANTE",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/74eef69f1acec55cb8bf381cd1bb3d58a3f5d758?placeholderIfAbsent=true"
        }
      ]
    },
    {
      title: "Categoria Carroceria | Saiba mais",
      products: [
        {
          id: '19',
          title: "TRANSTORA",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/0d1b3476876ebe209b0da2a07de180d258715975?placeholderIfAbsent=true"
        },
        {
          id: '20',
          title: "VTAV | BOIADEIRA",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/40ce4ff0c958918a70fc448f08607950cc3d05b9?placeholderIfAbsent=true"
        },
        {
          id: '21',
          title: "COMPACTADOR DE LIXO",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/05bf7c2d94cf79dbbf907b095e779561ef526d0e?placeholderIfAbsent=true"
        }
      ]
    },
    {
      title: "Categoria Carroceria | Saiba mais",
      products: [
        {
          id: '22',
          title: "CABINE SUPLEMENTAR",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/899073a58378536de1364291a82f65fe81ca47ae?placeholderIfAbsent=true"
        },
        {
          id: '23',
          title: "PRODUTO SEM NOME",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/edf67d728093f622aaa8d6e4f76a158cef7ec220?placeholderIfAbsent=true"
        },
        {
          id: '24',
          title: "MECANISMO OPERACIONAL DE DEMARCAÇÃO VIÁRIA",
          image: "https://api.builder.io/api/v1/image/assets/TEMP/c1d1fc69dfdd4b1a140f4f960f47213c0ac36ac0?placeholderIfAbsent=true"
        }
      ]
    }
  ];

  return (
    <section id="implementations" className="bg-[rgba(233,233,233,1)] flex w-full flex-col items-center pb-[95px] px-20 max-md:max-w-full max-md:px-5">
      <div className="bg-white z-10 flex mt-[-200px] w-full max-w-[1274px] flex-col items-stretch pt-[94px] pb-[166px] px-[71px] rounded-[20px_20px_0px_0px] max-md:max-w-full max-md:pb-[100px] max-md:px-5">
        <nav className="flex items-center gap-[40px_65px] text-sm text-black font-medium text-center leading-none max-md:max-w-full">
          <img
            src={logoBlack}
            alt="CHEKAUTO Logo"
            className="h-[40px] object-contain"
          />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`self-stretch my-auto hover:text-brand-yellow transition-colors ${
                activeCategory === category ? 'text-brand-yellow' : ''
              }`}
            >
              {category}
              {activeCategory === category && (
                <div className="bg-brand-yellow flex shrink-0 h-[5px] mt-1" />
              )}
            </button>
          ))}
        </nav>

        {productSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mt-[73px] max-md:mt-10">
            <div className="max-md:max-w-full">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                {section.products.map((product, productIndex) => (
                  <div key={productIndex} className="w-[33%] max-md:w-full max-md:ml-0 flex flex-col">
                    <div className="border flex flex-col items-stretch justify-center px-[70px] py-5 rounded-[8px_8px_0px_0px] border-[rgba(204,204,204,1)] border-solid max-md:px-5 text-sm text-black font-medium text-center leading-loose">
                      <div>
                        {section.title.split('|')[0]} |{" "}
                        <button 
                          onClick={() => navigate(`/produto/${product.id}`)}
                          className="underline text-[rgba(250,169,84,1)] hover:text-brand-yellow transition-colors"
                        >
                          {section.title.split('|')[1]}
                        </button>
                      </div>
                    </div>
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      image={product.image}
                      buttonText={product.buttonText}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col items-center mt-[49px] max-md:mt-10">
          <div className="border flex flex-col items-stretch text-sm text-black font-medium text-center leading-loose justify-center px-[70px] py-5 rounded-[8px_8px_0px_0px] border-[rgba(204,204,204,1)] border-solid max-md:px-5 w-[350px] max-w-full">
            <div>
              Categoria Carroceria |{" "}
              <button 
                onClick={() => navigate('/produto/outros')}
                className="underline text-[rgba(250,169,84,1)] hover:text-brand-yellow transition-colors"
              >
                Saiba mais
              </button>
            </div>
          </div>
          <div className="border flex w-[350px] max-w-full flex-col items-center px-[31px] py-[26px] rounded-[0px_0px_8px_8px] border-[rgba(204,204,204,1)] border-solid max-md:px-5">
            <h3 className="text-[rgba(22,28,45,1)] text-xl font-semibold leading-none text-center">
              OUTROS IMPLEMENTOS
            </h3>
            <div className="bg-brand-yellow self-stretch flex flex-col items-stretch justify-center mt-[42px] px-[35px] py-[54px] max-md:mt-10 max-md:px-5">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/f82672a60befd28412ea9ad539d6988b3d47c203?placeholderIfAbsent=true"
                alt="Outros implementos"
                className="aspect-[1.85] object-contain w-[177px]"
              />
            </div>
            <div className="flex w-[59px] items-stretch gap-[13px] mt-[22px]">
              <div className="bg-brand-yellow flex w-2.5 shrink-0 h-2.5 rounded-[50%]" />
              <div className="border flex w-[11px] shrink-0 h-[11px] rounded-[50%] border-[rgba(174,174,174,1)] border-solid" />
              <div className="border flex w-[11px] shrink-0 h-[11px] rounded-[50%] border-[rgba(174,174,174,1)] border-solid" />
            </div>
            <button 
              onClick={() => navigate('/produto/outros')}
              className="rounded bg-brand-yellow self-stretch flex flex-col items-center text-base text-black font-semibold whitespace-nowrap text-center leading-loose mt-5 pt-3.5 pb-[23px] px-[35px] hover:bg-brand-yellow-dark transition-colors max-md:px-5"
            >
              CONSULTAR
            </button>
            <button 
              onClick={() => navigate('/produto/outros')}
              className="text-black text-sm font-medium leading-[25px] text-center underline mt-[17px] hover:text-brand-yellow transition-colors"
            >
              Mostrar detalhes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Felipe Alves",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/369717c01ae7026d9af90ba5271dd9cbed7dc8bb?placeholderIfAbsent=true",
      text: "Antes de conhecer a CHEKAUTO, nossos cadastros demoravam semanas para serem concluídos. Hoje, tudo é feito com rapidez e transparência. Finalmente encontramos uma empresa que transmite confiança em cada etapa.",
      rating: "4.9"
    },
    {
      name: "Carlos Mendes",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/f96280e9585368efde65ff0779e9edc99bb0ae38?placeholderIfAbsent=true",
      text: "A CHEKAUTO resolveu em dias um processo que já estava parado há meses. Atendimento ágil, seguro e sem complicação. Agora sei que posso contar com quem realmente entende do setor automotivo pesado.",
      rating: "4.9"
    },
    {
      name: "Ricardo Souza",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/18838f3dc04b315b46e29f9e430bb70331a8536d?placeholderIfAbsent=true",
      text: "O diferencial da CHEKAUTO é a tranquilidade que eles passam. Entreguei toda a documentação e tive a certeza de que meu cadastro estava em boas mãos. Resultado: tudo validado e pronto para rodar.",
      rating: "4.9"
    }
  ];

  return (
    <section className="bg-white flex w-full flex-col items-center px-20 max-md:max-w-full max-md:px-5">
      <div className="bg-[rgba(240,186,29,1)] flex min-h-[77px] w-screen max-w-none -mx-20 max-md:-mx-5" />
      <h2 className="text-black text-[15px] font-semibold leading-10 tracking-[9px] text-center self-center mt-[130px] max-md:mt-10">
        DEPOIMENTOS
      </h2>
      <div className="self-center w-full max-w-[1270px] mt-[98px] max-md:max-w-full max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          {testimonials.map((testimonial, index) => (
            <article key={index} className="w-[33%] max-md:w-full max-md:ml-0">
              <div className="flex grow flex-col items-center text-neutral-900 font-normal text-center leading-[1.4] max-md:mt-10">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="aspect-[1] object-contain w-[95px] rounded-[50%]"
                />
                <h3 className="text-[22px] font-bold mt-[23px]">
                  {testimonial.name}
                </h3>
                <blockquote className="text-xs leading-[17px] self-stretch mt-1">
                  "{testimonial.text}"
                </blockquote>
                <div className="text-base ml-11 mt-[27px]">
                  {testimonial.rating}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

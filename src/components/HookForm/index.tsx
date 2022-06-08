import { useForm } from 'react-hook-form';

export const HookForm = ({ children }: any) => {
  const { handleSubmit } = useForm();

  function onSubmit(values: any) {
    console.log({ values });
    return new Promise((resolve: any) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve();
      }, 3000);
    });
  }

  return <form onSubmit={handleSubmit(onSubmit)}>{children}</form>;
};

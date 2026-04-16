type Props = {
  onClick?: () => void;
};

export const Backdrop = (props: Props) => {
  const { onClick } = props;

  return <div className='fixed top-0 left-0 z-100000 min-h-dvh min-w-dvw bg-black opacity-70' onClick={onClick} />;
};

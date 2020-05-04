declare module '2co-react' {
  interface TCOProps {
    sellerId: string;
    publishableKey: string;
    sandbox?: boolean;
    showForm: boolean;
    showModal?: boolean;
    showLoading?: boolean;
    returnToken: (token: string) => void;
  }
  const TCO: React.ComponentClass<TCOProps, {}>;

  export default TCO;
}

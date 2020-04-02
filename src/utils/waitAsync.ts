const waitAsync = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));
export default waitAsync;

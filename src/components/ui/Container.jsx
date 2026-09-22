/* eslint-disable react/prop-types */

/** Largura e respiro horizontais padrão de todas as seções. */
const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-6 md:px-12 ${className}`}>{children}</div>
);

export default Container;

import React, { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  isInView?: boolean;
  isInViewPort: (value: boolean) => void;
}


export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ isInViewPort, isInView }) => {
  const ref = useRef<HTMLDivElement>(null);
  const observed = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {

      if (entry?.isIntersecting) {

        isInViewPort(true);
        observed.current = true;
      } else {
        observed.current = false;
        isInViewPort(false)
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    if (ref.current && window && ref.current.getBoundingClientRect().top < window.innerHeight) {
      isInViewPort(true);
      observed.current = true;
    }


    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };


  }, [isInView]);


  return (
    <>
      <div className='' ref={ref} style={{ height: '1px' }}></div >
    </>
  );
}
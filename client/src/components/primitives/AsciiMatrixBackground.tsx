import React from 'react';

interface AsciiMatrixBackgroundProps {
  className?: string;
  opacity?: number;
}

const ASCII_STREAM = `
             ^ : i < > 
           ^ I ~ ? } ] [ 
         . I i ? ] [ x v u r t 
       ~ ] ) f U w a h d @ U \ 
     ( f X m M $ $ $ $ & h f 
    t c Z W $ $ $ $ $ $ $ $ 
   t z w B $ $ $ $ $ $ $ $ $ 
  { u Z 8 $ $ $ $ $ $ $ $ $ 
  { r L # $ $ $ $ $ $ $ $ $ 
  [ t U h B $ $ $ $ $ $ $ $ 
  ] / Y b & $ $ $ $ $ $ $ $ 
  [ t U b W @ $ $ $ $ $ $ $ 
  } r L h W @ $ $ $ $ $ $ $ 
  ( c Z * & B @ $ $ $ $ $ $ 
  f J d M 8 B B B B B E O 
 v Z a & 8 % 8 8 8 8 8 8 
 J p * & & & W W W M M M 
 O b * M M M # # * * * o 
 0 d a o o o a a a a a a 
 C Z q p p p d b k h d d 
 x z U C C C L Q @ m c m 
 { | t f j j r n C Y Q O 
 ~ - [ } { 1 ) \ f > ! l 
 i ~ - ] [ { } { 1 ) \ f 
 < _ ? [ ] { { 1 1 1 1 1 
 _ ? [ ] { 1 1 ) ) { } 
 - ] [ [ [ { } } 1 ( ) \ 
 ? ? ? ~ - - ] } ) ) { 1 
 ~ - - ~ < < < + ? { 1 1 
 _ + < i ! l 1 > + } : : 
 ~ > ! I : : l ~ } x Q a # o q O C L O O Q C Y z c u n r t | } ~ < i i ~ - [ { } \ j u z z u f ) l ! l l l : ^
 i ! I : " " " " * : [ n O a a b @ L C Q O O L U z v u x j t { } _ i I : l < _ [ { \ r Y 0 p b d w Q t / ( } ~ :
 I : *             " ! ] x Q k b q Q C C Q O Q J Y c u n r j / ) ] ~ l : : I > + } { \ u L p * W & W p q Z C v } :
                   _ f J p p m L C C Q Q L J X v n x r f / ) ] ~ l : : I > + ? } \ u Q d * W % B B B % % % % W h
                   ^ > ( z Z Z O J U J C C J Y z u x r j f / ( [ + ! : : l < + ? } \ n J w k * W & % B $ $ $ $ $ W
                   : [ r J L C Y X Y U U Y z u x j f t t / ( } _ i I I ! < _ ? } ( r X Q w d h o # & % $ $ $ $ M q
`;

export const AsciiMatrixBackground: React.FC<AsciiMatrixBackgroundProps> = ({
  className = '',
  opacity = 0.15,
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none font-mono text-[9px] leading-[11px] text-neutral-800 dark:text-neutral-300 flex items-center justify-center p-6 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <pre className="whitespace-pre font-mono font-medium tracking-tighter">
        {ASCII_STREAM}
      </pre>
    </div>
  );
};

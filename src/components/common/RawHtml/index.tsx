import { HTMLAttributes, useMemo } from 'react';

type AllowedWrappers = 'div' | 'span' | 'a' | 'b' | 'p';

const DEFAULT_WRAPPER = 'div';

const sanitize = (htmlString: string): string => {
  return htmlString.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*/gim, '');
};

export interface IRawHtmlProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    'dangerouslySetInnerHTML' | 'children'
  > {
  readonly children?: string;
  readonly as?: AllowedWrappers;
}

export const RawHtml = ({
  children,
  as: Wrapper = DEFAULT_WRAPPER,
  ...props
}: IRawHtmlProps): JSX.Element => {
  const cleanHTML = useMemo(
    () => ({ __html: sanitize(children || '') }),
    [children]
  );

  return <Wrapper {...props} dangerouslySetInnerHTML={cleanHTML} />;
};

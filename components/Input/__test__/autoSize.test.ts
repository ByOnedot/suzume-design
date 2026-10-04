import autoSizeTextAreaHeight from '../autoSizeTextAreaHeight';

describe('Input autoSizeText', () => {
  // jsdom does no layout, so `scrollHeight` is always 0 and the computed
  // height collapses to the border box. Browsers give a <textarea> a border
  // from the UA stylesheet; jsdom 30 no longer does, so the border is set
  // explicitly to keep the assertion that it contributes to the height.
  const createTextArea = () => {
    const textarea = document.createElement('textarea');
    // A `border-width` only computes to a real length when the border style is
    // not `none`, which is how a UA stylesheet styles a textarea anyway.
    textarea.style.border = '1px solid';
    document.body.appendChild(textarea);
    return textarea;
  };

  afterEach(() => {
    document.body.querySelectorAll('textarea').forEach((node) => node.remove());
  });

  it('single row height includes the border', () => {
    const textarea = createTextArea();
    const style = autoSizeTextAreaHeight(true, textarea);
    expect(style.height).toBe(2);
  });

  it('minRows scales the single row height', () => {
    const textarea = createTextArea();
    const style = autoSizeTextAreaHeight(
      {
        minRows: 2,
        maxRows: 4,
      },
      textarea
    );
    expect(style.height).toBe(2);
  });
});

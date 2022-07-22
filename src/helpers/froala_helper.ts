import Cookies from 'js-cookie';

export const froalaConfig = {
  height: 250,
  imageUploadMethod: 'POST',
  imageUpload: true,
  imageUploadParam: 'file',
  requestHeaders: {
    Authorization: `Bearer ${Cookies.get(process.env.REACT_APP_ACCESS_TOKEN!)}`,
  },
  imageUploadURL: `${process.env.REACT_APP_BASE_URL_API}/froala/store`,
  imageManagerDeleteMethod: 'DELETE',
  imageManagerDeleteURL: `${process.env.REACT_APP_BASE_URL_API}/froala/delete`,
  imageManagerLoadURL: `${process.env.REACT_APP_BASE_URL_API}/froala`,
  toolbarButtons: [
    'undo',
    'redo',
    'paragraphFormat',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    // 'subscript',
    // 'superscript',
    // 'fontFamily',
    'fontSize',
    'textColor',
    // 'backgroundColor',
    // 'inlineStyle',
    'clearFormatting',
    '|',
    'alignLeft',
    'alignCenter',
    'alignRight',
    'alignJustify',
    'formatOLSimple',
    'formatOL',
    'formatUL',
    // 'paragraphFormat',
    // 'paragraphStyle',
    // 'lineHeight',
    'outdent',
    'indent',
    'quote',
    '|',
    'insertLink',
    'insertTable',
    'insertVideo',
    'insertImage',
    'specialCharacters',
  ],
  toolbar: {
    // Key represents the more button from the toolbar.
    moreText: {
      // List of buttons used in the  group.
      buttons: [
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'fontFamily',
        'fontSize',
        'textColor',
        'backgroundColor',
        'inlineStyle',
        'clearFormatting',
      ],
      // Alignment of the group in the toolbar.
      align: 'left',
      // By default, 3 buttons are shown in the main toolbar. The rest of them are available when using the more button.
      // buttonsVisible: 3
    },
    moreParagraph: {
      buttons: [
        'alignLeft',
        'alignCenter',
        'alignRight',
        'alignJustify',
        'formatOLSimple',
        'formatOL',
        'formatUL',
        'paragraphFormat',
        'paragraphStyle',
        'lineHeight',
        'outdent',
        'indent',
        'quote',
      ],
      align: 'left',
      // buttonsVisible: 3
    },
    moreRich: {
      buttons: [
        'insertLink',
        'insertImage',
        'insertVideo',
        'insertTable',
        'specialCharacters',
        'embedly',
        'insertHR',
      ],
      align: 'left',
      //   buttonsVisible: 3
    },
    moreMisc: {
      buttons: ['fullscreen', 'getPDF', 'spellChecker', 'selectAll', 'help'],
      align: 'right',
      //   buttonsVisible: 2
    },
  },
};

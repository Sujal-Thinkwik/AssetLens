import { images } from '@/assets';

export const HERO = {
  title: 'Turn any asset spreadsheet into clean inventory data',
  text: 'Upload an Excel or CSV export of your devices. AssetLens finds the asset type, manufacturer, model, serial number, CPU, RAM, storage and screen size for you, whatever the column names or order.'
};

export const STEPS = [
  {
    title: 'Upload your file',
    text: 'Drag an .xlsx, .xls or .csv file into the upload area, or browse for it. Workbooks with several sheets are read sheet by sheet.',
    image: images.stepUpload
  },
  {
    title: 'Columns are detected',
    text: 'Headers are matched by name first. When a header is missing or unusual, the values themselves are used to work out what each column holds.',
    image: images.stepDetect
  },
  {
    title: 'Review the results',
    text: 'Browse, search, sort and page through the extracted assets. Every other column from your file is kept alongside.',
    image: images.stepReview
  }
];

export const HIGHLIGHTS = [
  {
    title: 'Built for messy, real-world spreadsheets',
    text: 'Exports rarely look the same twice. AssetLens copes with the differences so you do not have to clean files by hand.',
    points: [
      'Title rows above the table are skipped automatically',
      'Column names and order can vary between files',
      'Missing details are picked up from description columns',
      'Extra columns are never discarded'
    ],
    image: images.highlightLayouts
  },
  {
    title: 'Your files stay in your browser',
    text: 'Spreadsheets are read directly on your device. Nothing is uploaded to a server, so asset data stays with you.',
    points: [
      'No account or sign-in required',
      'Works with files up to 20 MB',
      'Column details show exactly how each field was found'
    ],
    image: images.highlightPrivacy
  }
];

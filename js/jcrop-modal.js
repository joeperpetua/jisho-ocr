const jcrop = Jcrop.attach('ocr-target');
const rect = Jcrop.Rect.create(100,100,100,100);
const options = {};
jcrop.newWidget(rect,options);
console.log(jcrop.active.pos);
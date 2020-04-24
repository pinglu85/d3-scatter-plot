const width = 800;
const height = 500;
const circleRadius = 4;

const svg = d3
  .select('scatter-plot')
  .append('svg')
  .attr('width', `${width + 100}`)
  .attr('height', `${height + 60}`);

const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(url)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.log(err));

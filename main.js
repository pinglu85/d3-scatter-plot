const xMargin = 80;
const yMargin = 20;
const width = 800;
const height = 500;
const circleRadius = 6;
const color = d3.scaleOrdinal(d3.schemeCategory10);
const timeFormat = d3.timeFormat('%M:%S');

const svg = d3
  .select('.scatter-plot')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);

const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(url)
  .then((data) => {
    // Formate Time in data for Y scale
    const formattedData = data.map((d) => {
      const parsedTime = d.Time.split(':');
      return {
        ...d,
        Time: new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]), // 1970 Jan 01 Thu 00:xx:xx
      };
    });

    // Scale X year axis
    const xMax = d3.max(data, (d) => d.Year + 1);
    const xMin = d3.min(data, (d) => d.Year - 1);
    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);

    // Scale Y time axis
    const yMax = d3.max(formattedData, (d) => d.Time);
    const yMin = d3.min(formattedData, (d) => d.Time);
    const yScale = d3.scaleTime().domain([yMin, yMax]).range([0, height]);

    // X axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    svg
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', `translate(${xMargin}, ${height + yMargin})`);

    // Y axis
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
    svg
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', `translate(${xMargin}, ${yMargin})`);

    // Y axis description
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .text('Time in Minutes')
      .attr('font-size', 16)
      .attr('x', -180)
      .attr('y', 30);

    // Tooltip container
    const tooltip = d3
      .select('.scatter-plot')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

    // Dot
    svg
      .append('g')
      .selectAll('circle')
      .data(formattedData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('data-xvalue', (d) => d.Year)
      .attr('data-yvalue', (d) => d.Time)
      .attr('cx', (d) => xScale(d.Year))
      .attr('cy', (d) => yScale(d.Time))
      .attr('r', circleRadius)
      .attr('transform', `translate(${xMargin}, ${yMargin})`)
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .attr('fill', (d) => color(d.Doping !== ''))
      .on('mouseover', (d, i) => {
        const newLine = d.Doping ? '<br><br>' : null;
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip
          .attr('data-year', d.Year)
          .html(
            `${d.Name}: ${d.Nationality}<br>Year: ${d.Year} Time: ${data[i].Time}${newLine}${d.Doping}`
          )
          .style('left', `${xScale(d.Year) + 300}px`)
          .style('top', `${yScale(d.Time)}px`);
      })
      .on('mouseout', () =>
        tooltip.transition().duration(200).style('opacity', 0)
      );

    // Legend label container
    const legendContainer = svg.append('g').attr('id', 'legend');

    // legend labels
    const legend = legendContainer
      .selectAll('g')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${height / 2 - i * 20})`);

    // Legend label rectangle
    legend
      .append('rect')
      .attr('x', width + xMargin - 18)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', color);

    legend
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', width + xMargin - 24)
      .attr('y', 12)
      .attr('font-size', 12)
      .text((d) =>
        d ? 'Riders with doping allegations' : 'No doping allegations'
      );
  })
  .catch((err) => console.log(err));

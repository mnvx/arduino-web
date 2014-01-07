var tr = d3.select("#data")
  .append('table')
    .selectAll('tr');

tr.data([''])
  .enter()
  .append('tr')
    .append('td')
    .text('Value');

d3.json("get-data", function(data) {
  tr.data(data)
    .enter()
    .append('tr')
      .append('td')
      .text(function (d) { return d.value; });
});

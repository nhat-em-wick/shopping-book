module.exports = (page, perPage, totalRecords, x) => {
  const start = (page - 1) * perPage;
  const end = page * perPage;
  const totalPages = Math.ceil(totalRecords.length / perPage);
  const records = totalRecords.slice(start, end);
  return { records, totalPages, page, x};
};

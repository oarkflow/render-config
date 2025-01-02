const handlePublish = (data: unknown) => {
  console.log("Published data:", data);
  const urlParams = new URLSearchParams(window.location.search);
  const nodeId = urlParams.get("nodeId");
  if (nodeId) {
    // Todo : Here you can implement the logic to save the website data and remove the data from local storage

    localStorage.setItem(nodeId, JSON.stringify(data));
  } else {
    console.log("nodeId not found in query params");
  }
};

export default handlePublish;
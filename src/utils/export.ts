export const exportFileExcel = (data: any, name: string) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', `${name}.xlsx`);

  document.body.appendChild(link);
  link.click();

  link.remove();
};

export const downloadFilePdfFromS3 = (link: string, name: string) => {
  fetch(link)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a Blob from the response
      const url = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = name; // You can set the filename here
      document.body.appendChild(link);

      // Trigger the click event to initiate the download
      link.click();

      // Remove the temporary link element
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error('Error fetching PDF:', error);
    });
};

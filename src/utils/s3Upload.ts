
export  const uploadFileToS3 = async (url:unknown, file:unknown) => {
    console.log("Uploading to S3...");
    
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });
        if (!response.ok) {
            throw new Error(`Failed to upload file: ${response.statusText}`);
        }
        return response;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
  };
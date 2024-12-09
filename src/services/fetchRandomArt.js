const MET_API_URL =
  "https://collectionapi.metmuseum.org/public/collection/v1/objects/"

async function fetchRandomArt() {
  const artNumber = Math.floor(Math.random() * 49068) + 1

  const response = await fetch(`${MET_API_URL}${artNumber}`)
  if (!response.ok) {
    console.error("Failed to fetch random art")
    return "https://via.placeholder.com/150"
  }
  const artData = await response.json()

  if (artData.primaryImageSmall) {
    return artData.primaryImageSmall
  } else {
    return "https://via.placeholder.com/150"
  }
}

export default fetchRandomArt

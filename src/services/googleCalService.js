import { CLIENT_ID, API_KEY, SCOPES } from "./googleCalConfig";

export const initializeGoogleApi = async () => {
  try {
    await new Promise((resolve, reject) => {
      gapi.load("client:auth2", () => {
        if (gapi.client) {
          resolve();
        } else {
          reject("Google API client failed to load");
        }
      });
    });
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES,
    });

    console.log("Google API initialized successfully");
  } catch (error) {
    console.error("Error initializing Google API:", error);
  }
};

export const fetchEvents = async (calendarId = "primary") => {
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: "startTime",
    });
    console.log("Events fetched successfully");
    return response.result.items;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const createEvent = async (eventDetails, calendarId = "primary") => {
  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId,
      resource: eventDetails,
    });
    console.log("Event created successfully:", response.result.htmlLink);
    return response.result;
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
};

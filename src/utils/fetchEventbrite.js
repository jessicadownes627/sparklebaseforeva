import axios from "axios";

const EVENTBRITE_TOKEN = import.meta.env.VITE_EVENTBRITE_KEY;

export const getLocalEvents = async (city) => {
  const now = new Date().toISOString();

  try {
    const response = await axios.get("https://www.eventbriteapi.com/v3/events/search/", {
      headers: {
        Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
      },
      params: {
        "location.address": city,
        "start_date.range_start": now,
        "sort_by": "date",
        "page_size": 5
      }
    });

    return response.data.events || [];
  } catch (error) {
    console.error("Eventbrite error:", error.message);
    return [];
  }
};

import db from "../drizzle.ts";
import { pageData } from "../schemas.ts";
import { eq } from "drizzle-orm";

const CreatePageDataInBackground = (pageName: string) => {
  console.log("Creating page data for", pageName);

  db.insert(pageData)
    .values({
      pageName,
      visitCount: 0,
      lastVisitedTime: new Date(),
    })
    .returning()
    .execute()
    .then((page) => {
      if (page.length === 0) {
        console.log("Failed to create page data for", pageName);
      } else {
        // console.log("Page data created for", pageName, page[0]);
        return page[0];
      }
    })
    .catch((err) => {
      console.error("Error creating page data for", pageName, err);
    });
};

const GetPageDataInBackground = (pageName: string) => {
  console.log("Getting page data for", pageName);

  db.select()
    .from(pageData)
    .where(eq(pageData.pageName, pageName))
    .execute()
    .then((page) => {
      if (page.length === 0) {
        console.log("No page data found for", pageName);
      } else {
        // console.log("Page data found for", pageName, page[0]);
        return page[0];
      }
    })
    .catch((err) => {
      console.error("Error getting page data for", pageName, err);
    });
};

const UpdatePageDataInBackground = (pageName: string) => {
  // console.log("Updating page data for", pageName);

  db.select()
    .from(pageData)
    .where(eq(pageData.pageName, pageName))
    .execute()
    .then((page) => {
      if (page.length === 0) {
        console.log("No page data found for", pageName);
        CreatePageDataInBackground(pageName);
      } else {
        const visitCount = page[0].visitCount! + 1;

        const istanbulTime = new Date().toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        });

        const istanbulSetHour = new Date(istanbulTime).setHours(
          new Date(istanbulTime).getHours() + 3,
        );

        const istanbulDate = new Date(istanbulSetHour);

        db.update(pageData)
          .set({
            visitCount,
            lastVisitedTime: istanbulDate,
          })
          .where(eq(pageData.pageName, pageName))
          .returning()
          .execute()
          .then((page) => {
            if (page.length === 0) {
              console.log("Failed to update page data for", pageName);
            } else {
              // console.log("Page data updated for", pageName, page[0]);
            }
          })
          .catch((err) => {
            console.error("Error updating page data for", pageName, err);
          });
      }
    })
    .catch((err) => {
      console.error("Error getting page data for", pageName, err);
    });
};

export {
  CreatePageDataInBackground,
  GetPageDataInBackground,
  UpdatePageDataInBackground,
};

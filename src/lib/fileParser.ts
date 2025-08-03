export interface FileMetadata {
  customerName: string;
  customerAddress: string;
  meterCode: string;
  meterNumber: string;
  contractNumber: string;
}

export interface ConsumptionData {
  date: Date;
  consumption: number;
  hour: number;
  dayOfWeek: number;
}

export interface ParsedFileData {
  metadata: FileMetadata;
  consumptionData: ConsumptionData[];
}

export const parseFile = async (file: File): Promise<ParsedFileData> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");

      const metadata: FileMetadata = {
        customerName: "",
        customerAddress: "",
        meterCode: "",
        meterNumber: "",
        contractNumber: "",
      };

      let dataStartIndex = -1;
      let dateColumnIndex = -1;
      let timeColumnIndex = -1;
      let consumptionColumnIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.includes('"שם לקוח"') && line.includes('"כתובת"')) {
          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            const dataLine = lines[j]?.trim();
            if (
              dataLine &&
              dataLine.includes('"') &&
              !dataLine.includes('"שם לקוח"') &&
              !dataLine.includes('"קוד מונה"')
            ) {
              const columns = dataLine
                .split(",")
                .map((col) => col.trim().replace(/"/g, ""));
              if (
                columns.length >= 2 &&
                columns[0] &&
                columns[1] &&
                columns[0] !== " " &&
                columns[1] !== " "
              ) {
                metadata.customerName = columns[0];
                metadata.customerAddress = columns[1];
                break;
              }
            }
          }
        }

        if (
          line.includes('"קוד מונה"') &&
          line.includes('"מספר מונה"') &&
          line.includes('"מספר חוזה"')
        ) {
          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            const dataLine = lines[j]?.trim();
            if (
              dataLine &&
              dataLine.includes('"') &&
              !dataLine.includes('"קוד מונה"') &&
              !dataLine.includes('"תאריך"')
            ) {
              const columns = dataLine
                .split(",")
                .map((col) => col.trim().replace(/"/g, ""));
              if (
                columns.length >= 3 &&
                columns[0] &&
                columns[1] &&
                columns[2] &&
                columns[0] !== " " &&
                columns[1] !== " " &&
                columns[2] !== " "
              ) {
                metadata.meterCode = columns[0].trim();
                metadata.meterNumber = columns[1].trim();
                metadata.contractNumber = columns[2].trim();
                break;
              }
            }
          }
        }

        if (
          line.includes('"תאריך"') &&
          line.includes('"מועד תחילת הפעימה"') &&
          line.includes('"צריכה בקוט""ש"')
        ) {
          dataStartIndex = i;
          const columns = line
            .split(",")
            .map((col) => col.trim().replace(/"/g, ""));
          dateColumnIndex = columns.findIndex((col) => col === "תאריך");
          timeColumnIndex = columns.findIndex(
            (col) => col === "מועד תחילת הפעימה"
          );
          consumptionColumnIndex = columns.findIndex(
            (col) => col === "צריכה בקוטש"
          );
          break;
        }
      }

      if (
        dataStartIndex === -1 ||
        dateColumnIndex === -1 ||
        timeColumnIndex === -1 ||
        consumptionColumnIndex === -1
      ) {
        console.error("Could not find required columns in CSV");
        resolve({ metadata, consumptionData: [] });
        return;
      }

      const parsed: ConsumptionData[] = [];

      for (let i = dataStartIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        try {
          const columns = line
            .split(",")
            .map((col) => col.trim().replace(/"/g, ""));

          if (
            columns.length <
            Math.max(dateColumnIndex, timeColumnIndex, consumptionColumnIndex) +
              1
          ) {
            continue;
          }

          const dateStr = columns[dateColumnIndex];
          const timeStr = columns[timeColumnIndex];
          const consumptionStr = columns[consumptionColumnIndex];

          if (!dateStr || !timeStr || !consumptionStr) continue;

          const consumption = parseFloat(consumptionStr);
          if (isNaN(consumption) || consumption <= 0) continue;

          const [day, month, year] = dateStr.split("/").map(Number);
          const [hour, minute] = timeStr.split(":").map(Number);

          if (
            isNaN(day) ||
            isNaN(month) ||
            isNaN(year) ||
            isNaN(hour) ||
            isNaN(minute)
          ) {
            continue;
          }

          const date = new Date(year, month - 1, day, hour, minute);

          if (isNaN(date.getTime())) {
            continue;
          }

          const jerusalemDate = new Date(
            date.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
          );
          const dayOfWeek = jerusalemDate.getDay();

          parsed.push({
            date,
            consumption,
            hour: date.getHours(),
            dayOfWeek: dayOfWeek,
          });
        } catch (error) {
          console.warn("Error parsing CSV row:", error);
          continue;
        }
      }

      resolve({ metadata, consumptionData: parsed });
    };
    reader.readAsText(file);
  });
};

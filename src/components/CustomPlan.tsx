import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Trash2 } from "lucide-react";

interface TimeSlot {
  id: string;
  name: string;
  discount: number;
  startHour: number;
  endHour: number;
  days: string[];
}

interface CustomPlanProps {
  onPlanSelect: (plan: TimeSlot[]) => void;
}

const CustomPlan = ({ onPlanSelect }: CustomPlanProps) => {
  const [customSlots, setCustomSlots] = useState<TimeSlot[]>([]);
  const [newSlot, setNewSlot] = useState({
    name: "",
    discount: "",
    startHour: "",
    endHour: "",
    days: [] as string[],
  });

  const daysOfWeek = [
    { id: "sun", label: "א'" },
    { id: "mon", label: "ב'" },
    { id: "tue", label: "ג'" },
    { id: "wed", label: "ד'" },
    { id: "thu", label: "ה'" },
    { id: "fri", label: "ו'" },
    { id: "sat", label: "ש'" },
  ];

  const addTimeSlot = () => {
    if (
      !newSlot.name ||
      !newSlot.discount ||
      !newSlot.startHour ||
      !newSlot.endHour
    ) {
      return;
    }

    const slot: TimeSlot = {
      id: Date.now().toString(),
      name: newSlot.name,
      discount: parseFloat(newSlot.discount),
      startHour: parseInt(newSlot.startHour),
      endHour: parseInt(newSlot.endHour),
      days: newSlot.days,
    };

    setCustomSlots([...customSlots, slot]);
    setNewSlot({
      name: "",
      discount: "",
      startHour: "",
      endHour: "",
      days: [],
    });
  };

  const removeTimeSlot = (id: string) => {
    setCustomSlots(customSlots.filter((slot) => slot.id !== id));
  };

  const toggleDay = (dayId: string) => {
    const days = newSlot.days.includes(dayId)
      ? newSlot.days.filter((d) => d !== dayId)
      : [...newSlot.days, dayId];

    setNewSlot({ ...newSlot, days });
  };

  const formatTimeRange = (start: number, end: number) => {
    const formatHour = (hour: number) =>
      hour.toString().padStart(2, "0") + ":00";
    return `${formatHour(start)}-${formatHour(end)}`;
  };

  const formatDays = (days: string[]) => {
    if (days.length === 7) return "כל השבוע";
    if (days.length === 0) return "ללא ימים";
    return days
      .map((d) => daysOfWeek.find((day) => day.id === d)?.label)
      .join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">
          הגדר מסלול מותאם אישית
        </h3>
        <p className="text-muted-foreground">
          הגדר את מסלולי ההנחה של הספק שלך ומצא את השילוב הכי משתלם
        </p>
      </div>

      {/* טופס הוספת מסלול */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            הוסף מסלול הנחה
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* פרטי המסלול */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="slot-name">שם המסלול</Label>
              <Input
                id="slot-name"
                placeholder="למשל: מסלול לילה"
                value={newSlot.name}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="discount">אחוז הנחה (%)</Label>
              <Input
                id="discount"
                type="number"
                placeholder="20"
                min="0"
                max="100"
                value={newSlot.discount}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, discount: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start-hour">שעת התחלה</Label>
                <Input
                  id="start-hour"
                  type="number"
                  placeholder="23"
                  min="0"
                  max="23"
                  value={newSlot.startHour}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startHour: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="end-hour">שעת סיום</Label>
                <Input
                  id="end-hour"
                  type="number"
                  placeholder="7"
                  min="0"
                  max="23"
                  value={newSlot.endHour}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endHour: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* בחירת ימים */}
          <div>
            <Label className="mb-3 block">ימי השבוע</Label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.id}
                  variant={
                    newSlot.days.includes(day.id) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => toggleDay(day.id)}
                  className="h-10"
                >
                  {day.label}
                </Button>
              ))}
            </div>

            <Button
              onClick={addTimeSlot}
              className="w-full"
              disabled={
                !newSlot.name ||
                !newSlot.discount ||
                !newSlot.startHour ||
                !newSlot.endHour
              }
            >
              <Plus className="w-4 h-4" />
              הוסף מסלול
            </Button>
          </div>
        </div>
      </Card>

      {/* רשימת המסלולים שנוספו */}
      {customSlots.length > 0 && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-success rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-success-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                המסלולים שלך
              </h3>
            </div>
            <Badge variant="secondary">{customSlots.length} מסלולים</Badge>
          </div>

          <div className="space-y-3">
            {customSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">
                      {slot.name}
                    </h4>
                    <Badge variant="default">{slot.discount}% הנחה</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{formatTimeRange(slot.startHour, slot.endHour)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDays(slot.days)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeSlot(slot.id)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <Button
              onClick={() => onPlanSelect(customSlots)}
              size="lg"
              className="w-full"
              disabled={customSlots.length === 0}
            >
              השתמש במסלולים אלה לחישוב
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CustomPlan;

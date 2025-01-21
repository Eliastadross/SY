import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Checkbox } from "./components/ui/checkbox";

interface Sale {
  date: string;
  province: string;
  clientName: string;
  outletName: string;
  brand: string;
  sku: string;
  availability: string;
  posm: {
    posters: boolean;
    display: boolean;
    promotionalMaterials: boolean;
  };
}

export default function SalesTrackingApp() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [formData, setFormData] = useState<Sale>({
    date: new Date().toLocaleDateString(),
    province: "",
    clientName: "",
    outletName: "",
    brand: "",
    sku: "",
    availability: "Available",
    posm: {
      posters: false,
      display: false,
      promotionalMaterials: false,
    },
  });

  const brandsToSkus: Record<string, string[]> = {
    ELEGANCE: [
      "MAX 100 FF",
      "MAX 100 L",
      "MAX 100 SILVER",
      "KS MAX",
      "KS BEVEL SILVER",
      "KS FF BLACK",
      "KS L",
      "KS MENTHOL CRUSHBALL",
      "KS DOUBLE BLAST",
      "QS CBF Ice Mint",
      "QS L",
      "QS UL",
      "SS CBF Blueberry Menthol",
      "SS CBF Ice Mint",
      "SS LIGHT",
      "SS ULTRA LIGHT",
      "SS MENTHOL",
      "SS SPR MINT",
      "SS DOUBLE APPLE",
      "SS GUM & MINT",
      "SS STRAWBERRY",
    ],
    MASTER: [
      "100'S SOFT",
      "Slim White one",
      "Slim Blue",
      "QS UL (WHITE)",
      "QS LIGHTS (BLUE)",
      "KS LIGHTS (BLUE)",
      "KS UL (SILVER)",
    ],
    Manchester: [
      "100'S SILVER",
      "100'S BLUE",
      "KS Blue",
      "KS Silver",
      "KS Double Drive",
      "KS Menthol",
      "QS Pearl",
      "QS Red",
      "QS Blue",
      "SS Menthol",
      "SS Grape",
      "SS Chocolate",
      "SS Strawberry",
      "SS Green Apple",
    ],
    OSCAR: [
      "100'S SOFT (SILVER)",
      "KS UL (SILVER)",
      "QS (WHITE)",
      "SS UL (SILVER)",
    ],
  };

  const [brands] = useState<string[]>(Object.keys(brandsToSkus));
  const [filteredSkus, setFilteredSkus] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (field: keyof Sale["posm"]) => {
    setFormData((prevData) => ({
      ...prevData,
      posm: {
        ...prevData.posm,
        [field]: !prevData.posm[field],
      },
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "brand") {
      setFilteredSkus(brandsToSkus[value] || []);
      setFormData((prevData) => ({
        ...prevData,
        sku: "", // Reset SKU when brand changes
      }));
    }
  };

  const provinceList = [
    "Damascus",
    "Rural Damascus",
    "Aleppo",
    "Daraa",
    "Deir El Zor",
    "Hama",
    "Hasaka",
    "Homs",
    "Latakia",
    "Sweida",
    "Tartous",
    "Idleb",
    "Qunaitra",
    "Raqqah",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentDate = new Date().toLocaleDateString();
    setSalesData([...salesData, { ...formData, date: currentDate }]);
    setFormData({
      date: new Date().toLocaleDateString(),
      province: "",
      clientName: "",
      outletName: "",
      brand: "",
      sku: "",
      availability: "Available",
      posm: { posters: false, display: false, promotionalMaterials: false },
    });
  };

  const exportToCSV = () => {
    const csvData = [
      [
        "Date",
        "Province",
        "Client Name",
        "Outlet Name",
        "Brand",
        "SKU",
        "Availability",
        "POSM Posters",
        "POSM Display",
        "POSM Promotional Materials",
      ],
      ...salesData.map((sale) => [
        sale.date,
        sale.province,
        sale.clientName,
        sale.outletName,
        sale.brand,
        sale.sku,
        sale.availability,
        sale.posm.posters ? "Yes" : "No",
        sale.posm.display ? "Yes" : "No",
        sale.posm.promotionalMaterials ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sales_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const scheduleExport = (hours: number, minutes: number) => {
      const now = new Date();
      const exportTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
      );
      if (exportTime < now) {
        exportTime.setDate(exportTime.getDate() + 1);
      }
      const delay = exportTime.getTime() - now.getTime();

      return setTimeout(() => {
        exportToCSV();
        console.log(`CSV exported at ${hours}:${minutes}`);
      }, delay);
    };

    const timer1 = scheduleExport(13, 0); // 1:00 PM
    const timer2 = scheduleExport(18, 0); // 6:00 PM

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [salesData]);

  return (
    <Card className="w-full max-w-3xl mx-auto mt-10">
      <CardHeader>
        {/* Title */}
        <div className="flex flex-col items-center">
          {/* Centered Text */}
          <div className="text-2xl font-semibold text-black-800 dark:text-black-300">
            ELEGANCE SYRIA
          </div>
          {/* Availability Performance */}
          <CardTitle className="text-2xl font-bold mt-2">
            Availability Performance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="province">Province</Label>
            <Select
              value={formData.province}
              onValueChange={(value) => handleSelectChange("province", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a province" />
              </SelectTrigger>
              <SelectContent>
                {provinceList.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="outletName">Outlet Name</Label>
            <Input
              id="outletName"
              name="outletName"
              value={formData.outletName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Select
              value={formData.brand}
              onValueChange={(value) => handleSelectChange("brand", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Select
              value={formData.sku}
              onValueChange={(value) => handleSelectChange("sku", value)}
              disabled={!filteredSkus.length}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an SKU" />
              </SelectTrigger>
              <SelectContent>
                {filteredSkus.map((sku) => (
                  <SelectItem key={sku} value={sku}>
                    {sku}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="availability">Availability</Label>
            <Select
              value={formData.availability}
              onValueChange={(value) =>
                handleSelectChange("availability", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Not Available">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Label className="text-md font-bold">POSM</Label>

            {/* Posters */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="posters"
                checked={formData.posm.posters}
                onCheckedChange={() => handleCheckboxChange("posters")}
              />
              <Label htmlFor="posters">Posters</Label>
            </div>

            {/* Display */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="display"
                checked={formData.posm.display}
                onCheckedChange={() => handleCheckboxChange("display")}
              />
              <Label htmlFor="display">Display</Label>
            </div>

            {/* Promotional Materials */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="promotionalMaterials"
                checked={formData.posm.promotionalMaterials}
                onCheckedChange={() =>
                  handleCheckboxChange("promotionalMaterials")
                }
              />
              <Label htmlFor="promotionalMaterials">
                Promotional Materials
              </Label>
            </div>
          </div>
          <Button
            type="submit"
            className="mt-4 bg-green-500 text-white hover:bg-green-600"
          >
            Add Visit
          </Button>
        </form>
        <Button
          onClick={exportToCSV}
          className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
        >
          Export to Excel
        </Button>

        {/* Summary Table */}

        <div className="mt-6">
          <h2 className="text-lg font-bold dark:text-white">Summary</h2>
          <div className="overflow-x-auto">
            {/* Ensures responsiveness */}
            <table className="table-auto w-full mt-4 border-collapse border border-gray-200 text-sm dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                    Date
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                    Province
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                    Client Name
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                    Outlet Name
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                    Brand
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                    SKU
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                    Availability
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                    Posters
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                    Display
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                    Promotional Materials
                  </th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale, index) => (
                  <tr
                    key={index}
                    className={`text-center ${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-700"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                      {sale.date}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                      {sale.province}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                      {sale.clientName}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                      {sale.outletName}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                      {sale.brand}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                      {sale.sku}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                      {sale.availability}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                      {sale.posm.posters ? "Yes" : "No"}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                      {sale.posm.display ? "Yes" : "No"}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300">
                      {sale.posm.promotionalMaterials ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

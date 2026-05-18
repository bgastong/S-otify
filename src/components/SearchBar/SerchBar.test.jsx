import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import SearchBar from "./SearchBar";

function Wrapper() {
  const [search, setSearch] = useState("");

  return (
    <SearchBar
      searchTerm={search}
      onSearch={setSearch}
    />
  );
}

describe("SearchBar component", () => {
  it("actualiza el valor del input", async () => {
    const user = userEvent.setup();

    render(<Wrapper />);

    const input = screen.getByPlaceholderText(
      "Buscar por canción o artista..."
    );

    await user.type(input, "Buenos Tiempos");

    expect(input).toHaveValue("Buenos Tiempos");
  });
});
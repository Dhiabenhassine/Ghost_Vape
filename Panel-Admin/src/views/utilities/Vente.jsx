import * as React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, NomLiquide, theme) {
  return {
    fontWeight:
      NomLiquide.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const columns = [
  {
    field: 'NomLiquide',
    headerName: 'Nom Liquide',
    width: 150,
    editable: true,
  },
  {
    field: 'NbrFlaconSale',
    headerName: 'Nbr Flacon Vendu',
    width: 150,
    editable: true,
  },
  {
    field: 'PriceUnitSales',
    headerName: 'Prix Unitaire',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'PriceLiquide',
    headerName: 'Prix Liquide',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'ProfitSales',
    headerName: 'Benefis Vente',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'TotalSales',
    headerName: 'Total Vente',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'created_at',
    headerName: 'Date de Vente',
    width: 200,
    editable: true,
  },
];

export default function Vente() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [VendreLiquide, setVendreLiquide] = useState({
    NomLiquide: "",
    NbrFlacon: "",
    PriceLiquide: ""
  });
  const [liquideOptions, setLiquideOptions] = useState([]);
  const theme = useTheme();

  const fetchData = async () => {
    try {
      const [salesResponse, liquideResponse] = await Promise.all([
        axios.get('http://127.0.0.1:4000/StockController/selectAllSales'),
        axios.get('http://127.0.0.1:4000/StockController/selectAllLiquide')
      ]);

      const salesData = salesResponse.data.map((row, index) => ({
        ...row,
        id: row.ID_Sales || `id-${index}`,
      }));
      setRows(salesData);

      const liquideData = liquideResponse.data.map((liquide) => ({
        value: liquide.NomLiquide,
        label: liquide.NomLiquide
      }));
      setLiquideOptions(liquideData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendreLiquide((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event) => {
    setVendreLiquide((prev) => ({
      ...prev,
      NomLiquide: event.target.value,
    }));
  };

  const VenteLiquide = async () => {
    try {
      const { NomLiquide, NbrFlacon, PriceLiquide } = VendreLiquide;
      const response = await axios.post("http://127.0.0.1:4000/StockController/vendreLiquide", { NomLiquide, NbrFlacon, PriceLiquide });
      setOpenModal(false);
      setVendreLiquide(
        {
          NomLiquide: "",
          NbrFlacon: "",
          PriceLiquide: ""
        }
      )
      fetchData(); 
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    row.NomLiquide.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ height: 700, width: '75%', marginLeft: '15%', background: 'white' }}>
      <Box component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > :not(style)': { m: 1 },
        }}
        noValidate
        autoComplete="off">
        <TextField
          id="standard-basic"
          label="Search"
          variant="standard"
          value={search}
          onChange={handleSearch}
          sx={{ marginLeft: '2%', top: '2%' }}
        />
        <AddIcon sx={{ cursor: 'pointer' }} onClick={() => setOpenModal(true)} />
      </Box>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Vente Liquide</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
            <InputLabel id="NomLiquide">Nom Liquide</InputLabel>
            <Select
              labelId="NomLiquide"
              id="NomLiquide"
              value={VendreLiquide.NomLiquide}
              onChange={handleSelectChange}
              input={<OutlinedInput label="NomLiquide" />}
              MenuProps={MenuProps}
            >
              {liquideOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  style={getStyles(option.value, VendreLiquide.NomLiquide, theme)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Nbr Flacon"
            name="NbrFlacon"
            value={VendreLiquide.NbrFlacon}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Prix Liquide"
            name="PriceLiquide"
            value={VendreLiquide.PriceLiquide}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={VenteLiquide}>Add</Button>
        </DialogActions>
      </Dialog>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ marginTop: '2%' }}
      />
    </Box>
  );
}

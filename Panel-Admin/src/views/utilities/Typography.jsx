import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const columns = [
  { field: 'NomLiquide', headerName: 'Liquide', width: 150, editable: true },
  { field: 'BaseQte', headerName: 'Qte Base', width: 110, editable: true },
  { field: 'AromeQte', headerName: 'Qte Arome', type: 'number', width: 110, editable: true },
  { field: 'BasePrice', headerName: 'Prix Base', type: 'number', width: 110, editable: true },
  { field: 'AromePrice', headerName: 'Prix Arome', type: 'number', width: 110, editable: true },
  { field: 'FlaconPrice', headerName: 'Prix Flacon', type: 'number', width: 110, editable: true },
  { field: 'LiquideVolum', headerName: 'Volume Liquide', type: 'number', width: 110, editable: true },
  { field: 'NbrFlacon', headerName: 'Nbr Flacon', type: 'number', width: 110, editable: true },
  { field: 'TypeLiquide', headerName: 'Type Liquide', width: 150, editable: true },
  { field: 'PriceUnit', headerName: 'Prix Unitaire', type: 'number', width: 110, editable: true },
  { field: 'Total', headerName: 'Total', type: 'number', width: 110, editable: true },
  { field: 'created_at', headerName: 'created_at', width: 150, editable: true }
];

function DataGridDemo() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [newLiquide, setNewLiquide] = useState({
    NomLiquide: '',
    TypeLiquide: '',
    BaseQte: '',
    AromeQte: '',
    BasePrice: '',
    AromePrice: '',
    PriceUnit: '',
    Total: ''
  });
  const [openModal, setOpenModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4000/StockController/selectAllLiquide');
      const data = response.data.map((row, index) => ({
        ...row,
        id: row.ID_Stock || `id-${index}`,
      }));
      setRows(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const insertLiquide = async () => {
    try {
      const flaconResult = await axios.get('http://127.0.0.1:4000/StockFlacon/selectAllFlacon');
      const { nbrFlaconEmpty, avgPriceUnitFlacon } = flaconResult.data;

      const BaseQte = parseFloat(newLiquide.BaseQte) || 0;
      const AromeQte = parseFloat(newLiquide.AromeQte) || 0;
      const BasePrice = parseFloat(newLiquide.BasePrice) || 0;
      const AromePrice = parseFloat(newLiquide.AromePrice) || 0;

      const liquideVolumFinal = BaseQte + AromeQte;
      const NbrFlacon = Math.ceil(liquideVolumFinal / 30);
      const baseQte = BaseQte / 1000;
      const BasePrices = BasePrice * baseQte;

      const priceUnitaire = (BasePrices + AromePrice + (avgPriceUnitFlacon * NbrFlacon)) / NbrFlacon;
      const priceFixed = priceUnitaire.toFixed(2);

      const Total = BasePrices + AromePrice + (avgPriceUnitFlacon * NbrFlacon);

      const updatedLiquide = {
        ...newLiquide,
        BaseQte: BaseQte,
        AromeQte: AromeQte,
        BasePrice: BasePrice,
        AromePrice: AromePrice,
        LiquideVolum: liquideVolumFinal,
        NbrFlacon: NbrFlacon,
        PriceUnit: priceFixed,
        Total: Total
      };

      const response = await axios.post('http://127.0.0.1:4000/StockController/InsertStock', updatedLiquide);
      
      setOpenModal(false);
      setNewLiquide({
        NomLiquide: '',
        TypeLiquide: '',
        BaseQte: '',
        AromeQte: '',
        BasePrice: '',
        AromePrice: '',
        PriceUnit: '',
        Total: ''
      });
      fetchData();

      // Show alert with needsFlacon and existingFlacon values from response
      window.alert(`Rest Flacon: ${response.data.restFlacon}, Total Flacon: ${response.data.TotalFlacon}`);
    } catch (err) {
      console.error('Error inserting liquide:', err);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewLiquide({ ...newLiquide, [name]: value });
  };

  const filteredRows = rows.filter((row) =>
    row.NomLiquide.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ height: 700, width: '100%', background: 'white' }}>
      <Box
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > :not(style)': { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="search"
          label="Search"
          variant="standard"
          value={search}
          onChange={handleSearch}
        />
        <AddIcon sx={{ cursor: 'pointer' }} onClick={() => setOpenModal(true)} />
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Liquide</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom Liquide"
            name="NomLiquide"
            value={newLiquide.NomLiquide}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mb: 1 ,width:'80%'}}
          />
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel>Type Liquide</InputLabel>
            <Select
              label="Type Liquide"
              name="TypeLiquide"
              value={newLiquide.TypeLiquide}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 1 ,width:'80%'}}

            >
              <MenuItem value="Fruite">Fruité</MenuItem>
              <MenuItem value="Gourmand">Gourmand</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Base Qte"
            name="BaseQte"
            value={newLiquide.BaseQte}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mb: 1 ,width:'80%'}}
          />
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel>Arome Qte</InputLabel>
            <Select
              label="Arome Qte"
              name="AromeQte"
              value={newLiquide.AromeQte}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 1 ,width:'80%'}}

            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Base Price"
            name="BasePrice"
            value={newLiquide.BasePrice}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mb: 1 ,width:'80%'}}
          />
          <TextField
            label="Arome Price"
            name="AromePrice"
            value={newLiquide.AromePrice}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mb: 1 ,width:'80%'}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={insertLiquide} variant="contained" color="primary">Add</Button>
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
        pageSizeOptions={[20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default DataGridDemo;

import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const columns = [
  { field: 'NomVape', headerName: 'Nom Vape', width: 190, editable: true },
  { field: 'PrixAchat', headerName: 'Prix Achat', width: 150, editable: true },
  { field: 'PrixVente', headerName: 'Prix Vente', type: 'number', width: 150, editable: true },
  { field: 'BeneficeVape', headerName: 'Bénéfice Vape', type: 'number', width: 150, editable: true },
  { field: 'created_at', headerName: 'Date de Vente', type: 'number', width: 200, editable: true },
];

export default function Vente() {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [vapeList, setVapeList] = useState([]);
  const [newVape, setNewVape] = useState({ NomVape: '', PrixVente: '' });
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4000/VapeController/selectAllVapesSales');
      const data = response.data.map((row, index) => ({
        ...row,
        id: row.ID_SalesVape || `id-${index}`,
        NomVape: row.NomVape || '',
      }));
      setRows(data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const fetchVapeList = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4000/VapeController/selectAllVapes');
      setVapeList(response.data);
    } catch (err) {
      console.error('Error fetching vape list:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchVapeList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVape((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const insertVape = async () => {
    if (!newVape.NomVape || !newVape.PrixVente) {
      console.error('Please fill out all fields.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:4000/VapeController/VenteVape', newVape);
      setOpenModal(false);
      fetchData();
    } catch (err) {
      console.error('Error inserting vape:', err);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    row.NomVape && row.NomVape.toLowerCase().includes(search.toLowerCase())
  );

  const handleCellClick = (params) => {
    // Example function; adjust as necessary
    console.log('Cell clicked:', params);
  };

  return (
    <Box sx={{ height: 700, width: '60%', marginLeft: '15%', background: 'white', marginTop: '3%' }}>
      <Box component="form" sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }}} noValidate autoComplete="off">
        <TextField
          id="search-field"
          label="Search"
          variant="standard"
          value={search}
          onChange={handleSearch}
          sx={{ marginLeft: '2%', top: '2%' }}
        />
        <AddIcon
          sx={{ cursor: 'pointer', marginLeft: '3%', marginTop: '2%' }}
          onClick={() => setOpenModal(true)}
        />
      </Box>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Vente Vape</DialogTitle>
        <DialogContent>
          <Select
            label="Nom Vape"
            name="NomVape"
            value={newVape.NomVape}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 1 }}
          >
            {vapeList.map((vape) => (
              <MenuItem key={vape.ID_Vape} value={vape.NomVape}>
                {vape.NomVape}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Prix Vente"
            name="PrixVente"
            value={newVape.PrixVente}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={insertVape} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 10 }}}}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ marginTop: '2%' }}
        onCellClick={handleCellClick}
      />
    </Box>
  );
}

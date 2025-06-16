import React, { useState, useEffect } from 'react';
import './App.css';
////////////////////////////function create///
function App() {
  const [formData, setFormData] = useState({
    title: '',
    features: [],
    gender: '',
    image: null,
    imagePreview: ''
  });
  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  
  // Load from localStorage////////////////////////////
  useEffect(() => {
    const data = localStorage.getItem('entries');
    if (data) {
      setEntries(JSON.parse(data));
    }
  }, []);

  // Save to localStorage----------------------
  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        features: checked
          ? [...prev.features, value]
          : prev.features.filter((f) => f !== value),
      }));
    } else if (type === 'file') {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            image: file,
            imagePreview: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload a valid image.');
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, gender, imagePreview } = formData;
    if (!title || !gender || !imagePreview) {
      alert('Please fill all required fields.');
      return;
    }

    if (editIndex !== null) {
      const updatedEntries = [...entries];
      updatedEntries[editIndex] = formData;
      setEntries(updatedEntries);
      setEditIndex(null);
    } else {
      setEntries([...entries, formData]);
    }
    setFormData({ title: '', features: [], gender: '', image: null, imagePreview: '' });
  };

  const handleEdit = (index) => {
    setFormData(entries[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updated = entries.filter((_, i) => i !== index);
      setEntries(updated);
    }
  };
//////////////////// form create///////////
  return (
    <div  className='form-vailidetion'>
      <div className='navber-form'>
      <h2>Data Entry</h2>
      <hr/>
      <form onSubmit={handleSubmit}>
                    <div className='head1'>
                   <label>Name: </label>
                   <input className='inpu-vailid' name="title" value={formData.title} onChange={handleChange} required placeholder='Enter full name' />
                     </div>
        <div>
          <label>Feature:</label><br/>
          <label><input type="checkbox" name="features" value="Feature A" checked={formData.features.includes('Feature A')} onChange={handleChange} /> Full Developer A</label>
          <label><input type="checkbox" name="features" value="Feature B" checked={formData.features.includes('Feature B')} onChange={handleChange} /> Software e. B</label>
        </div>
        <div>
          <label>Gender:</label>
          <label><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male</label>
          <label><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female</label>
        </div>
        <div>
          <label className='lable-image'>Image Upload:</label><br/>
          <input type="file" accept="image/*" onChange={handleChange} />
          {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" width="100" />}
        </div>
        <button className='btn-on' type="submit">{editIndex !== null ? 'Update' : 'Submit'}</button>
      </form>
      </div>  
            {/* <hr /> */}
{/* /////////////////////////////////entries////////// */}
     <div className='entry-data'>
      <h3>Entries:-</h3><hr/>
      <div >
        {entries.map((entry, index) => (
          <div className='data-all-deatails' key={index}>
           {entry.imagePreview && <img src={entry.imagePreview} alt="Uploaded" width="100" />}
            <h4>{entry.title}</h4>
            <p><strong>Gender:</strong> {entry.gender}</p>
            <p><strong>Features:</strong> {entry.features.join(', ') || 'None'}</p>

            <div style={{ marginTop: 10 }}>
              <button onClick={() => handleEdit(index)}>Edit</button>{' '}
              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default App;


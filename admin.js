function renderProductRow(product) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" value="${product.fields.name || ''}" data-field="name"></td>
        <td><input type="number" value="${product.fields.price || ''}" data-field="price"></td>
        <td><input type="text" value="${product.fields.category || ''}" data-field="category"></td>
        <td><input type="text" value="${product.fields.image || ''}" data-field="image"></td>
        <td>
            <button class="save-btn">Guardar</button>
        </td>
    `;

    tr.querySelector('.save-btn').addEventListener('click', async () => {
        const inputs = tr.querySelectorAll('input');
        const updatedFields = {};
        inputs.forEach(input => {
            updatedFields[input.dataset.field] = input.value;
        });
        await updateProduct(product.id, updatedFields);
        alert('Producto actualizado');
    });

    return tr;
}

async function renderAdminList() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = `<table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Imagen</th>
                <th>Acción</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>`;
    const tbody = productList.querySelector('tbody');
    const products = await getProducts();
    products.forEach(product => {
        tbody.appendChild(renderProductRow(product));
    });
}

renderAdminList();

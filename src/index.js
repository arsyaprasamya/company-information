import React from 'react';
import ReactDOM from 'react-dom';

class CompanyDashboard extends React.Component {
	state = {
		companies: []
	}

	componentDidMount() {
		fetch('http://localhost:8000/api/companies/')
			.then(response => response.json())
			.then(data => {
				this.setState({companies: data});
			})
	}

	createNewCompany = (company) => {
		fetch('http://localhost:8000/api/companies/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(company),
		}).then(response => response.json())
		.then(company => {
			this.setState({companies: this.state.companies.concat([company])});
		});
	}

	deleteCompany = (companyId) => {
		fetch(`http://localhost:8000/api/companies/${companyId}/`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(() => {
			this.setState({companies: this.state.companies.filter(company => company.id !== companyId)})
		});

	}
	render() {
		return (
			<main className="d-flex justify-content-center my-4">
				<div className="col-5">
					<CompanyList
						companies={this.state.companies}
						onDeleteClick={this.deleteCompany}
					/>
					<ToggleableCompanyForm
						onCompanyCreate={this.createNewCompany}
					/>
				</div>
			</main>
		)
	}
}

class CompanyList extends React.Component {
	render() {
		const companies = this.props.companies.map(company => (
			<DeleteableCompany
				key={company.id}
				id={company.id}
				name={company.name}
				address={company.address}
				revenue={company.revenue}
				phone={company.phone}
				onDeleteClick={this.props.onDeleteClick}
			></DeleteableCompany>
		));

		return (
			<div>
				{companies}
			</div>
		);
	}
}

class ToggleableCompanyForm extends React.Component {
	state = {
		inCreateMode: false
	}
	handleCreateClick = () => {
		this.setState({inCreateMode: true});
	}
	leaveCreateMode = () => {
		this.setState({inCreateMode: false});
	}
	handleCancleClick = () => {
		this.leaveCreateMode();
	}
	handleFormSubmit = (company) => {
		this.leaveCreateMode();
		this.props.onCompanyCreate(company);
	}
	render() {
		if (this.state.inCreateMode) {
			return (
				<div className="mb-3 p-4" style={{boxShadow: '0 0 10px #ccc'}} >
					<CompanyForm 
						onFormSubmit={this.handleFormSubmit}
						onCancelClick={this.handleCancleClick}></CompanyForm>
				</div>
				
			)
		}
		return (
			<button onClick={this.handleCreateClick} className="btn btn-secondary">
				<i className="fas fa-plus"></i>
			</button>
		);
	}
}

class CompanyForm extends React.Component {
	state = {
		name: this.props.name || '',
		address: this.props.address || '',
		revenue: this.props.revenue || '',
		phone: this.props.phone || ''
	}

	handleFormSubmit = (evt) => {
		evt.preventDefault();
		this.props.onFormSubmit({...this.state});
	}
	handleNameUpdate = (evt) => {
		this.setState({name: evt.target.value});
	}
	handleAddressUpdate = (evt) => {
		this.setState({address: evt.target.value});
	}
	handleRevenueUpdate = (evt) => {
		this.setState({revenue: evt.target.value});
	}
	handlePhoneUpdate = (evt) => {
		this.setState({phone: evt.target.value});
	}

	render() {
		const buttonText = this.props.id ? 'Update Company': 'Create';
		return (
			<form onSubmit={this.handleFormSubmit}>
				<div className="form-group">
					<label>
						Name:
					</label>
					<input type="text" placeholder="name"
						value={this.state.name} onChange={this.handleNameUpdate}
						className="form-control"
					/>
				</div>
				
				<div className="form-group">
					<label>
						Address:
					</label>
					<input type="text" placeholder="address"
						value={this.state.address} onChange={this.handleAddressUpdate}
						className="form-control"
					/>
				</div>
				
				<div className="form-group">
					<label>
						Revenue:
					</label>
					<input type="text" placeholder="revenue"
						value={this.state.revenue} onChange={this.handleRevenueUpdate}
						className="form-control"
					/>
				</div>

				<div className="form-group">
					<label>
						Phone No:
					</label>
					<input type="text" placeholder="code"
						value={this.state.phone} onChange={this.handlePhoneUpdate}
						className="form-control"
					/>
					<input type="text" placeholder="number"
						value={this.state.phone} onChange={this.handleRevenueUpdate}
						className="form-control"
					/>
				</div>

				<div className="form-group d-flex justify-content-between">
					<button type="submit" className="btn btn-md btn-primary">
						{buttonText}
					</button>
				</div>
			</form>
		)
	}
}

class DeleteableCompany extends React.Component {
	handleDelete = () => {
		this.props.onDeleteClick(this.props.id);
	}

	render() {
		const component = () => {
			return (
				<Company 
					name={this.props.name}
					address={this.props.address}
					revenue={this.props.revenue}
					phone={this.props.phone}
					onDeleteClick={this.handleDelete}
				/>
			)
		}
		return (
			<div className="mb-3 p-4" style={{boxShadow: '0 0 10px #ccc'}} >
				{component()}
			</div>
		)
	}
}

class Company extends React.Component {
	render() {
		return (
			<div className="card" /* style="width: 18rem;" */>
				<div className="card-header d-flex justify-content-between">
					<span>
						<strong>Name: </strong>{this.props.name}
					</span>
					<div>
						<span onClick={this.props.onDeleteClick}><i className="fas fa-trash"></i></span>
					</div>

				</div>
				<div className="card-body">
					{this.props.address}
				</div>
				<div className="card-footer">
					<strong>Revenue: </strong>  {this.props.revenue}
				</div>
				<div className="card-footer">
					<strong>Phone NO: </strong>  {this.props.phone}
				</div>
			</div>
		);
	}
}
ReactDOM.render(<CompanyDashboard />, document.getElementById('root'));
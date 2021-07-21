# oracle-apex-api

## Angular application to test the endpoints
```powershell
npm install
```

### Endpoints
- [POST]`http://localhost:8080/ords/shadynagy/User/Login` 
- [GET]`http://localhost:8080/ords/shadynagy/hr/employees/`

### Employees Endpoint header
|Name|Bind Variable|Access Method|Source Type|Data Type|
|-|-|-|-|-|
|Authorization|Authorization|IN|HTTP Header|String|
|X-APEX-STATUS-CODE|status|OUT|HTTP Header|String|

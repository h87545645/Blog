putty -ssh root@43.136.240.126:/root/ -pw "Tsp87545647" -m C:\U3D\U3D_proj\ET-EUI-Learn\auto_publish.txt
pscp.exe -r -pw "Tsp87545647" -P 22 C:\U3D\U3D_proj\ET-EUI-Learn\Bin root@43.136.240.126:/root/ET/Public
putty -ssh root@43.136.240.126:/root -pw "Tsp87545647" -m C:\U3D\U3D_proj\ET-EUI-Learn\auto_publish2.txt

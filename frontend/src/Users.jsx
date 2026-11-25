import { useState, useEffect } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

export default function Users() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function authHeader() {
        return { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }

    function handleUnauthorized() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
    }

    async function getUser() {
        try {
            const response = await fetch("http://localhost:3001/api/users", {
                headers: authHeader()
            })
            const data = await response.json()

            if (response.status === 401) return handleUnauthorized()

            if (response.ok && data.length > 0) {
                setName(data[0].name)
                setEmail(data[0].email)
            } else {
                console.error("Lekérési hiba:", data)
            }
        } catch (error) {
            alert("Szerverhiba!")
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    async function saveUser(e) {
        e.preventDefault()

        try {
            const response = await fetch("http://localhost:3001/api/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify({ name, email, password })
            })
            const data = await response.json()

            if (response.status === 401) return handleUnauthorized()

            alert(data.message)

            if (response.ok) {
                setPassword("")
                await getUser()
            }
        } catch (error) {
            alert("Szerverhiba!")
        }
    }

    return (
        <div className="container mt-4">
            <h1>Felhasználói adatok módosítása</h1>
            <Form onSubmit={saveUser}>
                <Form.Group className="mb-3">
                    <Form.Label>Név</Form.Label>
                    <Form.Control value={name}
                        onChange={e => setName(e.target.value)} placeholder="Név" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email}
                        onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Új jelszó </Form.Label>
                    <Form.Control type="password" value={password} minLength={8}
                        onChange={e => setPassword(e.target.value)} placeholder="Jelszó"  />
                </Form.Group>

                <Button type="submit" variant="primary">Módosítás</Button>
            </Form>
        </div>
    )
}
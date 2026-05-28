const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./user.model')

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '7d' }
  )
}

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const exists = await User.findOne({ where: { email } })
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Este correo ya está registrado'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ success: false, message: 'Error al registrar usuario' })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos'
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos'
      })
    }

    const token = generateToken(user)

    res.status(200).json({
      success: true,
      message: 'Sesión iniciada correctamente',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' })
  }
}

module.exports = { register, login }
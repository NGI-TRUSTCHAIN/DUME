package com.tidycity.code.views

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.tidycity.code.R
import com.tidycity.code.database_utils.DatabaseAccess
import com.tidycity.code.dataclasses_prototypes.Prototypes
import com.tidycity.code.firebase_utils.FirebaseDeclarations.firebaseAuth
import com.tidycity.code.utilities.Extensions.isInternetEnabled
import com.tidycity.code.utilities.Extensions.toast
import com.tidycity.code.webservices_utils.ExtensionsRetrofit

class SignInActivity : AppCompatActivity() {

    private lateinit var signInEmail: String
    private lateinit var signInPassword: String
    private lateinit var signInInputsArray: Array<EditText>
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var forgotPwd: TextView
    private lateinit var createAccountButton: TextView
    private lateinit var signInButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_in)

        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPwd)
        createAccountButton = findViewById(R.id.create_account)
        signInButton = findViewById(R.id.btnSignIn)
        forgotPwd = findViewById(R.id.pass_forget)

        signInInputsArray = arrayOf(etEmail, etPassword)
        createAccountButton.setOnClickListener {
            startActivity(Intent(this, CreateAccountActivity::class.java))
            finish()
        }

        signInButton.setOnClickListener {
            if (!isInternetEnabled()) {
                toast("Internet is disabled")
            } else  signInAccount()
        }

        forgotPwd.setOnClickListener {
            signInEmail = etEmail.text.toString().trim()
            if (signInEmail.isNotEmpty()) {
                firebaseAuth.sendPasswordResetEmail(etEmail.text.toString().trim())
                    .addOnCompleteListener { task ->
                        if (task.isSuccessful) {
                            toast("Please check your email")
                        }
                    }
            } else toast("Please add your email")
        }
    }

    private fun notEmpty(): Boolean = signInEmail.isNotEmpty() && signInPassword.isNotEmpty()

    private fun signInUser() {
        signInEmail = etEmail.text.toString().trim()
        signInPassword = etPassword.text.toString().trim()

        if (notEmpty()) {
            firebaseAuth.signInWithEmailAndPassword(signInEmail, signInPassword)
                .addOnCompleteListener { signIn ->
                    if (signIn.isSuccessful) {
                        toast("signed in successfully")
                        val userName = DatabaseAccess(this@SignInActivity)
                            .getUser(signInEmail)
                        val intent = Intent(this, HomeActivity::class.java)
                        intent.putExtra("email", signInEmail)
                        intent.putExtra("username", userName)
                        startActivity(intent)
                        finish()
                    } else toast("sign in failed")
                }
        } else {
            signInInputsArray.forEach { input ->
                if (input.text.toString().trim().isEmpty()) {
                    input.error = "${input.hint} is required"
                }
            }
        }
    }

    private fun signInAccount() {
        signInEmail = etEmail.text.toString().trim()
        signInPassword = etPassword.text.toString().trim()

        if (!notEmpty()){
            signInInputsArray.forEach { input ->
                if (input.text.toString().trim().isEmpty()) {
                    input.error = "${input.hint} is required"
                }
            }
        }

        ExtensionsRetrofit(this@SignInActivity)
            .authenticateAccount(credentials = Prototypes.SignInParams(
                email = signInEmail,
                password = signInPassword
            ))
    }
}
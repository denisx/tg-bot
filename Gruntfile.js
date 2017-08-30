module.exports = (grunt) => {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)
	grunt.loadNpmTasks('gruntify-eslint')

	grunt.initConfig({
		eslint: {
			options: {
				configFile: '.eslintrc.json',
				ignorePath: './.eslintignore',
				quiet: true
			},
			src: [
				'*/*.js',
				'*.js'
			]
		}
	})

	grunt.registerTask('default', [
		'eslint'
	])

	grunt.registerTask('lint', [
		'eslint'
	])
}
